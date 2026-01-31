import Parser from 'rss-parser';
import axios from 'axios';

const parser = new Parser();

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  creator?: string;
  categories?: string[];
}

export class NewsService {
  private readonly HEALTH_RSS_FEEDS = [
    'https://www.mobihealthnews.com/rss.xml',
    'https://www.fierceedevice.com/rss.xml',
    'https://www.healthcareitnews.com/rss.xml',
    'https://medcitynews.com/feed/',
    'https://digitalhealth.net/feed/'
  ];

  private readonly YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  private readonly YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

  async fetchHealthNews(): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];

    for (const feedUrl of this.HEALTH_RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const newsItems = feed.items.map(item => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          content: item.contentSnippet || item.content || '',
          creator: item.creator,
          categories: item.categories
        }));
        allNews.push(...newsItems);
      } catch (error) {
        console.error(`Error fetching RSS feed from ${feedUrl}:`, error);
      }
    }

    return allNews.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    ).slice(0, 20);
  }

  async fetchYouTubeVideos(): Promise<any[]> {
    if (!this.YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      const response = await axios.get(this.YOUTUBE_SEARCH_URL, {
        params: {
          part: 'snippet',
          q: 'digital health healthcare technology medical AI',
          type: 'video',
          order: 'relevance',
          publishedAfter: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          maxResults: 10,
          key: this.YOUTUBE_API_KEY
        }
      });

      return response.data.items.map((item: any) => ({
        title: item.snippet.title,
        description: item.snippet.description,
        videoId: item.id.videoId,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.medium.url
      }));
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  }

  filterDigitalHealthNews(news: NewsItem[]): NewsItem[] {
    const keywords = [
      'digital health', 'healthcare technology', 'medical AI', 'telemedicine',
      'health tech', 'medical device', 'digital therapeutics', 'mhealth',
      'wearable', 'health app', 'electronic health record', 'EHR'
    ];

    return news.filter(item => {
      const text = (item.title + ' ' + item.content).toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    });
  }
}
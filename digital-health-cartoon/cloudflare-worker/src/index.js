// Define Env interface for the worker
interface Env {
  YOUTUBE_API_KEY: string;
  GEMINI_API_KEY: string;
}

// Helper interfaces and functions for News Service
interface YoutubeVideo {
  title: string;
  description: string;
  link: string;
  publishedAt: string;
  thumbnail: string;
}

interface NewsItem {
  title: string;
  content: string;
  link: string;
  publishedAt: string;
}

async function fetchHealthNews(env: Env, query: string = '디지털 헬스케어 뉴스'): Promise<NewsItem[]> {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${env.YOUTUBE_API_KEY}`);
    const data: any = await response.json();

    if (!response.ok) {
      console.error('Error fetching YouTube health news:', data);
      return [];
    }

    const videos: YoutubeVideo[] = data.items.map((item: any) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.high.url,
    }));

    return videos.map(video => ({
      title: video.title,
      content: video.description,
      link: video.link,
      publishedAt: video.publishedAt,
    }));

  } catch (error: any) { // Catch as 'any' for worker context
    console.error('Error fetching YouTube health news:', error);
    return [];
  }
}

function filterDigitalHealthNews(news: NewsItem[]): NewsItem[] {
  const keywords = ['디지털 헬스케어', 'AI 의료', '원격 진료', '스마트 헬스케어', '웨어러블'];
  return news.filter(item => 
    keywords.some(keyword => 
      item.title.includes(keyword) || item.content.includes(keyword)
    )
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // YouTube news endpoint
    if (url.pathname === '/api/news/youtube' && request.method === 'GET') {
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=health%20news&type=video&maxResults=10&key=${env.YOUTUBE_API_KEY}`);
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Health news endpoint using free RSS feed
    if (url.pathname === '/api/news/rss' && request.method === 'GET') {
      try {
        const response = await fetch('https://news.google.com/rss/topics/CAEQiogKMKsBAAAAAAAAAAAAAAAAAAg?hl=en-US&gl=US&ceid=US:en');
        const text = await response.text();
        
        return new Response(text, {
          headers: { ...corsHeaders, 'Content-Type': 'application/rss+xml' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Health cartoon generation endpoint
    if (url.pathname === '/api/cartoon/generate' && request.method === 'POST') {
      try {
        let requestBody: { query?: string };
        try {
            requestBody = await request.json();
        } catch (jsonError: any) {
            console.error('Error parsing request JSON:', jsonError);
            return new Response(JSON.stringify({ error: 'Invalid JSON in request body.' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        const userQuery = requestBody.query || '디지털 헬스케어 뉴스'; // Use user query or default

        // Fetch and filter news
        const healthNews = await fetchHealthNews(env, userQuery);
        const digitalHealthNews = filterDigitalHealthNews(healthNews);

        if (digitalHealthNews.length === 0) {
            return new Response(JSON.stringify({ error: 'No digital health news found to generate cartoon.' }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        const newsText = digitalHealthNews.slice(0, 5).map(item => 
          `Title: ${item.title}\nContent: ${item.content ? item.content.substring(0, 200) : ''}...`
        ).join('\n\n');

        const prompt = `
        Based on these recent digital health news articles, create a 4-6 scene educational cartoon story that explains the key developments in an engaging way:

        ${newsText}

        Create a cartoon with:
        1. A catchy title
        2. A brief summary of the story
        3. 4-6 scenes, each with:
           - Visual description for the cartoon image
           - Short dialogue or caption
           - Numbered sequence

        Format your response as JSON:
        {
          "title": "Cartoon Title",
          "summary": "Brief story summary",
          "scenes": [
            {
              "sceneNumber": 1,
              "description": "Visual description of the scene",
              "dialogue": "Character dialogue or caption",
              "imagePrompt": "Detailed DALL-E prompt for generating this scene"
            }
          ]
        }
        `;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              responseMimeType: "application/json",
            },
          })
        });

        const geminiResponse = await response.json();
        
        // Check if Gemini response is valid JSON
        let cartoonData;
        try {
            cartoonData = JSON.parse(geminiResponse.candidates[0].content.parts[0].text);
        } catch (parseError: any) {
            console.error('Error parsing Gemini response:', parseError, geminiResponse.candidates[0].content.parts[0].text);
            return new Response(JSON.stringify({ error: 'Failed to parse Gemini response for cartoon data.' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Create a structured cartoon response
        const cartoon = {
          id: Date.now().toString(),
          title: cartoonData.title,
          summary: cartoonData.summary,
          scenes: cartoonData.scenes,
          createdAt: new Date().toISOString(),
          sources: digitalHealthNews.map(item => item.link)
        };
        
        return new Response(JSON.stringify(cartoon), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error: any) {
        console.error('Error generating cartoon:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate cartoon', details: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};
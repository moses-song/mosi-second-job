import express from 'express';
import { NewsService } from '../services/newsService';

const router = express.Router();
const newsService = new NewsService();

router.get('/latest', async (req, res) => {
  try {
    const allNews = await newsService.fetchHealthNews();
    const digitalHealthNews = newsService.filterDigitalHealthNews(allNews);
    res.json(digitalHealthNews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

router.get('/youtube', async (req, res) => {
  try {
    const videos = await newsService.fetchYouTubeVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const allNews = await newsService.fetchHealthNews();
    const digitalHealthNews = newsService.filterDigitalHealthNews(allNews);
    
    const summary = {
      totalNews: allNews.length,
      digitalHealthNews: digitalHealthNews.length,
      latestNews: digitalHealthNews.slice(0, 5),
      date: new Date().toISOString()
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export default router;
import express from 'express';
import { CartoonService } from '../services/cartoonService';
import { NewsService } from '../services/newsService';
import { DatabaseService } from '../services/databaseService';

const router = express.Router();
const cartoonService = new CartoonService();
const newsService = new NewsService();
const dbService = new DatabaseService();

router.post('/generate', async (req, res) => {
  try {
    const news = await newsService.fetchHealthNews();
    const digitalHealthNews = newsService.filterDigitalHealthNews(news);
    
    if (digitalHealthNews.length === 0) {
      return res.status(404).json({ error: 'No digital health news found' });
    }

    await dbService.cacheNews(digitalHealthNews);
    
    const cartoon = await cartoonService.generateCompleteCartoon(digitalHealthNews);
    await dbService.saveCartoon(cartoon);
    
    res.json(cartoon);
  } catch (error) {
    console.error('Error generating cartoon:', error);
    res.status(500).json({ error: 'Failed to generate cartoon' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const cartoon = await dbService.getLatestCartoon();
    if (!cartoon) {
      return res.status(404).json({ error: 'No cartoons found' });
    }
    res.json(cartoon);
  } catch (error) {
    console.error('Error fetching latest cartoon:', error);
    res.status(500).json({ error: 'Failed to fetch latest cartoon' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const news = await newsService.fetchHealthNews();
    const digitalHealthNews = newsService.filterDigitalHealthNews(news);
    const summary = await cartoonService.summarizeNewsForAI(digitalHealthNews);
    
    res.json({ 
      summary,
      newsCount: digitalHealthNews.length,
      date: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export default router;
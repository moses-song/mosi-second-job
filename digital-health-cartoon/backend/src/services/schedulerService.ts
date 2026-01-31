import * as cron from 'node-cron';
import { NewsService } from './newsService';
import { CartoonService } from './cartoonService';
import { DatabaseService } from './databaseService';

export class SchedulerService {
  private newsService: NewsService;
  private cartoonService: CartoonService;
  private dbService: DatabaseService;

  constructor() {
    this.newsService = new NewsService();
    this.cartoonService = new CartoonService();
    this.dbService = new DatabaseService();
  }

  startDailyCartoonGeneration() {
    cron.schedule('0 8 * * *', async () => {
      console.log('Starting daily cartoon generation at 8:00 AM');
      
      try {
        const news = await this.newsService.fetchHealthNews();
        const digitalHealthNews = this.newsService.filterDigitalHealthNews(news);
        
        if (digitalHealthNews.length === 0) {
          console.log('No digital health news found for today');
          return;
        }

        console.log(`Found ${digitalHealthNews.length} digital health news items`);
        
        await this.dbService.cacheNews(digitalHealthNews);
        
        const cartoon = await this.cartoonService.generateCompleteCartoon(digitalHealthNews);
        await this.dbService.saveCartoon(cartoon);
        
        console.log(`Successfully generated and saved cartoon: ${cartoon.title}`);
      } catch (error) {
        console.error('Error in daily cartoon generation:', error);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Seoul"
    });

    console.log('Daily cartoon generation scheduled for 8:00 AM KST');
  }

  startNewsUpdate() {
    cron.schedule('0 */6 * * *', async () => {
      console.log('Updating news cache every 6 hours');
      
      try {
        const news = await this.newsService.fetchHealthNews();
        const digitalHealthNews = this.newsService.filterDigitalHealthNews(news);
        
        await this.dbService.cacheNews(digitalHealthNews);
        
        console.log(`Updated news cache with ${digitalHealthNews.length} items`);
      } catch (error) {
        console.error('Error updating news cache:', error);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Seoul"
    });

    console.log('News update scheduled every 6 hours');
  }

  async testGeneration() {
    console.log('Running test cartoon generation...');
    
    try {
      const news = await this.newsService.fetchHealthNews();
      const digitalHealthNews = this.newsService.filterDigitalHealthNews(news);
      
      if (digitalHealthNews.length === 0) {
        console.log('No digital health news found for test');
        return;
      }

      await this.dbService.cacheNews(digitalHealthNews);
      
      const cartoon = await this.cartoonService.generateCompleteCartoon(digitalHealthNews);
      await this.dbService.saveCartoon(cartoon);
      
      console.log(`Test generation completed: ${cartoon.title}`);
    } catch (error) {
      console.error('Error in test generation:', error);
    }
  }

  startAll() {
    this.startDailyCartoonGeneration();
    this.startNewsUpdate();
  }
}
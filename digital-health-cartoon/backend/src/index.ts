import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cartoonRoutes from './routes/cartoon';
import newsRoutes from './routes/news';
import { SchedulerService } from './services/schedulerService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/cartoons', cartoonRoutes);
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Digital Health Cartoon API' });
});

app.get('/api/test-generation', async (req, res) => {
  try {
    const scheduler = new SchedulerService();
    await scheduler.testGeneration();
    res.json({ message: 'Test generation completed' });
  } catch (error) {
    console.error('Test generation failed:', error);
    res.status(500).json({ error: 'Test generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  if (process.env.NODE_ENV === 'production') {
    const scheduler = new SchedulerService();
    scheduler.startAll();
    console.log('Scheduler started for automatic cartoon generation');
  } else {
    console.log('Scheduler disabled in development mode');
    console.log('Run /api/test-generation to test cartoon generation');
  }
});
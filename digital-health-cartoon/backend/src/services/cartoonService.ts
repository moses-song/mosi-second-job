import OpenAI from 'openai';
import { NewsItem } from './newsService';

export interface CartoonScene {
  sceneNumber: number;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
  dialogue?: string;
}

export interface Cartoon {
  id: string;
  title: string;
  summary: string;
  scenes: CartoonScene[];
  createdAt: string;
  sources: string[];
}

export class CartoonService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateCartoonScenario(news: NewsItem[]): Promise<Cartoon> {
    const recentNews = news.slice(0, 5);
    const newsText = recentNews.map(item => 
      `Title: ${item.title}\nContent: ${item.content.substring(0, 200)}...`
    ).join('\n\n');

    const prompt = `
    Based on these recent digital health news articles, create a 4-6 scene cartoon story that explains the key developments in an engaging way:

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

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const cartoonData = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        id: Date.now().toString(),
        title: cartoonData.title,
        summary: cartoonData.summary,
        scenes: cartoonData.scenes,
        createdAt: new Date().toISOString(),
        sources: recentNews.map(item => item.link)
      };
    } catch (error) {
      console.error('Error generating cartoon scenario:', error);
      throw error;
    }
  }

  async generateImageForScene(scene: CartoonScene): Promise<string> {
    try {
      const enhancedPrompt = `
      Create a professional cartoon illustration for a digital health comic strip: ${scene.imagePrompt}
      
      Style: Clean, modern cartoon style with bright colors, suitable for healthcare technology topic.
      Format: Square aspect ratio, simple backgrounds, focus on characters and technology.
      `;

      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        style: "vivid"
      });

      return response.data?.[0]?.url || '';
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  async generateCompleteCartoon(news: NewsItem[]): Promise<Cartoon> {
    const cartoon = await this.generateCartoonScenario(news);
    
    for (let i = 0; i < cartoon.scenes.length; i++) {
      try {
        cartoon.scenes[i].imageUrl = await this.generateImageForScene(cartoon.scenes[i]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to generate image for scene ${i + 1}:`, error);
      }
    }

    return cartoon;
  }

  async summarizeNewsForAI(news: NewsItem[]): Promise<string> {
    const newsText = news.slice(0, 10).map(item => 
      `${item.title}: ${item.content.substring(0, 150)}...`
    ).join('\n');

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Summarize these digital health news headlines into 2-3 key themes:\n${newsText}`
          }
        ],
        max_tokens: 150
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Error summarizing news:', error);
      return 'Error generating summary';
    }
  }
}
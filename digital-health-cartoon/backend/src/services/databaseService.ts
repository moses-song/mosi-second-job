import sqlite3 from 'sqlite3';
import { Cartoon, CartoonScene } from '../services/cartoonService';
import { NewsItem } from '../services/newsService';

export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('./cartoons.db');
    this.initTables();
  }

  private initTables() {
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS cartoons (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          created_at TEXT NOT NULL,
          sources TEXT
        )
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS cartoon_scenes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cartoon_id TEXT NOT NULL,
          scene_number INTEGER NOT NULL,
          description TEXT NOT NULL,
          image_prompt TEXT NOT NULL,
          image_url TEXT,
          dialogue TEXT,
          FOREIGN KEY (cartoon_id) REFERENCES cartoons (id)
        )
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS news_cache (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          link TEXT UNIQUE NOT NULL,
          pub_date TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `);
    });
  }

  async saveCartoon(cartoon: Cartoon): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(
          `INSERT INTO cartoons (id, title, summary, created_at, sources) 
           VALUES (?, ?, ?, ?, ?)`,
          [cartoon.id, cartoon.title, cartoon.summary, cartoon.createdAt, JSON.stringify(cartoon.sources)],
          (err: any) => {
            if (err) {
              reject(err);
              return;
            }

            const stmt = (this.db as any).prepare(
              `INSERT INTO cartoon_scenes (cartoon_id, scene_number, description, image_prompt, image_url, dialogue) 
               VALUES (?, ?, ?, ?, ?, ?)`
            );

            cartoon.scenes.forEach((scene) => {
              stmt.run([
                cartoon.id,
                scene.sceneNumber,
                scene.description,
                scene.imagePrompt,
                scene.imageUrl || null,
                scene.dialogue || null
              ]);
            });

            stmt.finalize((err: any) => {
              if (err) reject(err);
              else resolve();
            });
          }
        );
      });
    });
  }

  async getLatestCartoon(): Promise<Cartoon | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM cartoons ORDER BY created_at DESC LIMIT 1`,
        [],
        async (err, row: any) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            resolve(null);
            return;
          }

          try {
            const scenes = await this.getCartoonScenes(row.id);
            resolve({
              id: row.id,
              title: row.title,
              summary: row.summary,
              createdAt: row.created_at,
              sources: JSON.parse(row.sources || '[]'),
              scenes
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async getCartoonScenes(cartoonId: string): Promise<CartoonScene[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM cartoon_scenes WHERE cartoon_id = ? ORDER BY scene_number`,
        [cartoonId],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          const scenes: CartoonScene[] = rows.map(row => ({
            sceneNumber: row.scene_number,
            description: row.description,
            imagePrompt: row.image_prompt,
            imageUrl: row.image_url,
            dialogue: row.dialogue
          }));

          resolve(scenes);
        }
      );
    });
  }

  async cacheNews(news: NewsItem[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(
        `INSERT OR IGNORE INTO news_cache (title, link, pub_date, content, created_at) 
         VALUES (?, ?, ?, ?, ?)`
      );

      let completed = 0;
      const total = news.length;

      news.forEach(item => {
        stmt.run([
          item.title,
          item.link,
          item.pubDate,
          item.content,
          new Date().toISOString()
        ], (err: any) => {
          if (err) {
            stmt.finalize();
            reject(err);
            return;
          }

          completed++;
          if (completed === total) {
            stmt.finalize((err: any) => {
              if (err) reject(err);
              else resolve();
            });
          }
        });
      });

      if (total === 0) {
        stmt.finalize();
        resolve();
      }
    });
  }

  async getCachedNews(): Promise<NewsItem[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM news_cache ORDER BY pub_date DESC LIMIT 50`,
        [],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          const news: NewsItem[] = rows.map(row => ({
            title: row.title,
            link: row.link,
            pubDate: row.pub_date,
            content: row.content
          }));

          resolve(news);
        }
      );
    });
  }

  close(): void {
    this.db.close();
  }
}
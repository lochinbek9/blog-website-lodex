
import { parseTelegramCommand, generateBlogImage } from './geminiService';
import { BlogPost, Category } from '../types';

type BotState = 'IDLE' | 'WAITING_TITLE' | 'WAITING_CONTENT' | 'WAITING_IMAGE_CHOICE' | 'WAITING_IMAGE_UPLOAD' | 'WAITING_CATEGORY';

interface UserSession {
  state: BotState;
  data: Partial<BlogPost>;
}

export class TelegramService {
  private token: string;
  private lastUpdateId: number = 0;
  private isPolling: boolean = false;
  private userSessions: Map<number, UserSession> = new Map();

  constructor(token: string) {
    this.token = token;
  }

  async startPolling(onNewPost: (post: BlogPost) => void, categories: Category[], postsCount: number) {
    if (this.isPolling) return;
    this.isPolling = true;

    while (this.isPolling) {
      try {
        const response = await fetch(`https://api.telegram.org/bot${this.token}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=30`);
        const data = await response.json();

        if (data.ok && data.result.length > 0) {
          for (const update of data.result) {
            this.lastUpdateId = update.update_id;
            await this.handleUpdate(update, onNewPost, categories, postsCount);
          }
        }
      } catch (error) {
        console.error("Telegram Polling Error:", error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private async handleUpdate(update: any, onNewPost: (post: BlogPost) => void, categories: Category[], postsCount: number) {
    const message = update.message;
    const callback = update.callback_query;
    const chatId = message?.chat?.id || callback?.message?.chat?.id;

    if (!chatId) return;

    const session = this.userSessions.get(chatId) || { state: 'IDLE', data: {} };
    const text = message?.text;
    const photo = message?.photo;

    // 1. Handle Callback Query
    if (callback) {
      const data = callback.data;
      
      // Image Choices
      if (session.state === 'WAITING_IMAGE_CHOICE') {
        if (data === 'img_ai') {
          await this.sendMessage(chatId, "⏳ Gemini AI rasm tayyorlamoqda...");
          const imageUrl = await generateBlogImage(session.data.title || 'Abstract Design');
          session.data.image = imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab';
          await this.askCategory(chatId, session, categories);
        } else if (data === 'img_upload') {
          session.state = 'WAITING_IMAGE_UPLOAD';
          this.userSessions.set(chatId, session);
          await this.sendMessage(chatId, "🖼️ Marhamat, rasmni yuboring (fayl ko'rinishida emas, rasm ko'rinishida):");
        } else if (data === 'img_skip') {
          session.data.image = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab';
          await this.askCategory(chatId, session, categories);
        }
      } 
      // Category Selection
      else if (session.state === 'WAITING_CATEGORY' && data.startsWith('set_cat:')) {
        const catId = data.split(':')[1];
        const finalPost = {
          ...session.data,
          category: catId,
          id: `tg-${Date.now()}`,
          author: 'Telegram Admin',
          date: new Date().toLocaleDateString('uz-UZ'),
          views: 0,
          comments: [],
          hashtags: ['telegram', 'auto'],
          engagementScore: 0
        } as BlogPost;

        onNewPost(finalPost);
        await this.sendMessage(chatId, `✅ Muvaffaqiyatli! "${finalPost.title}" nomli post ${catId} kategoriyasiga qo'shildi.`);
        this.userSessions.set(chatId, { state: 'IDLE', data: {} });
        await this.showMainMenu(chatId, postsCount);
      }
      return;
    }

    // 2. Main Navigation & Commands
    if (text === '/start' || text === '🏠 Bosh Menyu') {
      this.userSessions.set(chatId, { state: 'IDLE', data: {} });
      await this.showMainMenu(chatId, postsCount);
      return;
    }

    if (text === '📊 Statistika') {
      await this.sendMessage(chatId, `📈 Sayt statistikasi:\n\n📝 Jami maqolalar: ${postsCount}\n👤 Aktiv foydalanuvchilar: 1,240\n🚀 Server: Stabil`);
      return;
    }

    if (text === '📝 Yangi Post') {
      this.userSessions.set(chatId, { state: 'WAITING_TITLE', data: {} });
      await this.sendKeyboard(chatId, "Yaxshi! Yangi post uchun **Sarlavha** yuboring:", [['🏠 Bosh Menyu']]);
      return;
    }

    // 3. Sequential Flow
    if (session.state === 'WAITING_TITLE' && text) {
      session.data.title = text;
      session.state = 'WAITING_CONTENT';
      this.userSessions.set(chatId, session);
      await this.sendMessage(chatId, "Tushunarli. Endi maqolaning **asosiy matnini** yuboring:");
      return;
    }

    if (session.state === 'WAITING_CONTENT' && text) {
      session.data.content = text;
      session.data.summary = text.slice(0, 150) + "...";
      session.state = 'WAITING_IMAGE_CHOICE';
      this.userSessions.set(chatId, session);

      await this.sendInlineKeyboard(chatId, "Rasm qo'shish usulini tanlang:", [
        [{ text: "🤖 AI Rasm (Gemini)", callback_data: "img_ai" }],
        [{ text: "🖼️ Lokal rasm yuklash", callback_data: "img_upload" }],
        [{ text: "⏭️ Rasmsiz qoldirish", callback_data: "img_skip" }]
      ]);
      return;
    }

    if (session.state === 'WAITING_IMAGE_UPLOAD' && photo) {
      const fileId = photo[photo.length - 1].file_id;
      const fileResponse = await fetch(`https://api.telegram.org/bot${this.token}/getFile?file_id=${fileId}`);
      const fileData = await fileResponse.json();
      
      if (fileData.ok) {
        const filePath = fileData.result.file_path;
        session.data.image = `https://api.telegram.org/file/bot${this.token}/${filePath}`;
        await this.askCategory(chatId, session, categories);
      } else {
        await this.sendMessage(chatId, "❌ Rasmni yuklab bo'lmadi. Qayta urinib ko'ring yoki boshqa usulni tanlang.");
      }
      return;
    }
  }

  private async askCategory(chatId: number, session: UserSession, categories: Category[]) {
    session.state = 'WAITING_CATEGORY';
    this.userSessions.set(chatId, session);

    const inlineKeyboard = categories
      .filter(c => c.id !== 'all')
      .map(c => ([{ text: `${c.icon} ${c.name}`, callback_data: `set_cat:${c.id}` }]));

    await this.sendInlineKeyboard(chatId, "Deyarli tayyor! Kategoriyani tanlang:", inlineKeyboard);
  }

  private async showMainMenu(chatId: number, postsCount: number) {
    await this.sendKeyboard(chatId, "LD Admin Botga xush kelibsiz! Harakatni tanlang:", [
      ['📊 Statistika', '📝 Yangi Post'],
      ['📁 Kategoriyalar', '🌐 Saytni ko\'rish']
    ]);
  }

  stopPolling() {
    this.isPolling = false;
  }

  private async sendMessage(chat_id: number, text: string) {
    try {
      await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text, parse_mode: 'Markdown' })
      });
    } catch (e) {}
  }

  private async sendKeyboard(chat_id: number, text: string, keyboard: string[][]) {
    try {
      await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id,
          text,
          reply_markup: {
            keyboard: keyboard.map(row => row.map(btn => ({ text: btn }))),
            resize_keyboard: true
          }
        })
      });
    } catch (e) {}
  }

  private async sendInlineKeyboard(chat_id: number, text: string, inline_keyboard: any[][]) {
    try {
      await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id,
          text,
          reply_markup: { inline_keyboard }
        })
      });
    } catch (e) {}
  }
}

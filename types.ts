
export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  avatar: string;
  replies?: Comment[];
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image: string;
  additionalImages?: string[];
  category: string;
  hashtags: string[];
  comments: Comment[];
  views?: number;
  engagementScore?: number;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube yoki Vimeo link
  thumbnail: string;
  duration: string;
  level: 'Boshlang\'ich' | 'O\'rta' | 'Professional';
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface BotMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface BlogStats {
  dailyVisitors: number;
  monthlyVisitors: number;
  prevMonthVisitors: number;
  totalSubscribers: number;
  engagementTrends: any[];
  trafficSources: any[];
}

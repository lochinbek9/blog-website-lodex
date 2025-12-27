
import { BlogPost, Category, BlogStats, VideoLesson } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Barcha mavzular', icon: '🌍' },
  { id: 'tech', name: 'Texnologiya', icon: '💻' },
  { id: 'design', name: 'Dizayn', icon: '🎨' },
  { id: 'business', name: 'Biznes', icon: '💼' },
  { id: 'lifestyle', name: 'Turmush tarzi', icon: '🌿' },
  { id: 'ai', name: 'Sun\'iy Intellekt', icon: '🤖' },
];

export const MOCK_VIDEOS: VideoLesson[] = [
  {
    id: 'v1',
    title: 'Figma-da zamonaviy Glassmorphism dizayn',
    description: 'Ushbu darsda biz Liquid Glass effektlarini yaratish va ularni UI interfeyslarga integratsiya qilishni o\'rganamiz.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Dummy
    thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800',
    duration: '15:20',
    level: 'O\'rta',
    category: 'design',
    date: '10-Fevral, 2025'
  },
  {
    id: 'v2',
    title: 'AI orqali Web-dizaynni avtomatlashtirish',
    description: 'Dizayn jarayonlarida Gemini va Midjourney-dan samarali foydalanish strategiyalari.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    duration: '22:45',
    level: 'Professional',
    category: 'ai',
    date: '12-Fevral, 2025'
  },
  {
    id: 'v3',
    title: 'Minimalistik Brand Architecture sirlari',
    description: 'Brendingda nima uchun "kamroq - bu ko\'proq" tamoyili har doim ham ishlamaydi va qachon ishlaydi?',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&q=80&w=800',
    duration: '18:10',
    level: 'Boshlang\'ich',
    category: 'business',
    date: '14-Fevral, 2025'
  }
];

export const MOCK_STATS: BlogStats = {
  dailyVisitors: 1240,
  monthlyVisitors: 45200,
  prevMonthVisitors: 38100,
  totalSubscribers: 854,
  engagementTrends: [
    { day: 'Mon', views: 1100, comments: 12 },
    { day: 'Tue', views: 1350, comments: 18 },
    { day: 'Wed', views: 1200, comments: 15 },
    { day: 'Thu', views: 1500, comments: 22 },
    { day: 'Fri', views: 1800, comments: 30 },
    { day: 'Sat', views: 1400, comments: 10 },
    { day: 'Sun', views: 1240, comments: 8 },
  ],
  trafficSources: [
    { source: 'Search Engines', percentage: 45, color: 'bg-slate-900 dark:bg-white' },
    { source: 'Direct Access', percentage: 30, color: 'bg-slate-600 dark:bg-slate-300' },
    { source: 'Social Media', percentage: 15, color: 'bg-slate-400 dark:bg-slate-500' },
    { source: 'Referrals', percentage: 10, color: 'bg-slate-200 dark:bg-slate-700' },
  ]
};

export const MOCK_BLOGS_BY_LANG: Record<string, BlogPost[]> = {
  uz: [
    {
      id: 'post-1',
      title: 'Raqamli davrda minimalist arxitektura',
      summary: 'Nima uchun kamchilik yuqori darajadagi raqamli tajribalar uchun yakuniy standartga aylanmoqda.',
      content: `Arxitektura faqat binolar uchun emas. Raqamli sohada ma'lumotlarni qanday tuzishimiz qiymatni qanday qabul qilishimizni belgilaydi. Ushbu maqola Liquid Glass estetikasi va kulrang minimalizmning yangi hashamat standarti sifatida yuksalishini ko'rib chiqadi.`,
      author: 'LD Muharriri',
      date: '15-Yanvar, 2025',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      additionalImages: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
      ],
      category: 'design',
      hashtags: ['minimalizm', 'dizayn', 'arxitektura'],
      views: 15400,
      engagementScore: 92,
      comments: []
    }
  ],
  en: []
};

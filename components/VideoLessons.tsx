'use client';
import React, { useState } from 'react';
import { VideoLesson } from '../types';
import { MOCK_VIDEOS } from '../constants';

interface VideoLessonsProps {
  t: any;
}

const VideoLessons: React.FC<VideoLessonsProps> = ({ t }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredVideos = activeTab === 'all' 
    ? MOCK_VIDEOS 
    : MOCK_VIDEOS.filter(v => v.category === activeTab);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 md:px-0">
      <div className="mb-10 md:mb-16">
        <h1 className="text-4xl md:text-8xl font-black mb-6 md:mb-8 tracking-tighter uppercase dark:text-white leading-[1.1]">
          Learning <br className="hidden md:block" /> Evolution
        </h1>
        <p className="text-base md:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
          Dizayn va texnologiya olamidagi intellektual salohiyatingizni bizning maxsus video darslarimiz orqali rivojlantiring.
        </p>
      </div>

      {/* Tabs / Filter */}
      <div className="flex flex-row overflow-x-auto gap-3 mb-10 pb-4 no-scrollbar">
        {['all', 'design', 'tech', 'ai', 'business'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-slate-950 dark:bg-white text-white dark:text-black shadow-xl' 
                : 'glass text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24">
        {filteredVideos.map(video => (
          <div 
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="group cursor-pointer glass rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/20 dark:border-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={video.thumbnail} 
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                alt={video.title} 
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-90 md:scale-50 group-hover:scale-100 transition-transform duration-500">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1.5 glass rounded-lg text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">
                {video.duration}
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md">
                  {video.level}
                </span>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {video.date}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black dark:text-white mb-2 md:mb-3 uppercase tracking-tight group-hover:text-blue-500 transition-colors line-clamp-2">
                {video.title}
              </h3>
              <p className="text-slate-500 text-xs md:text-sm line-clamp-2 font-medium">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-12">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedVideo(null)} />
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl md:rounded-[4rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in duration-300">
            <iframe 
              src={selectedVideo.videoUrl} 
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 glass rounded-full text-white hover:scale-110 active:scale-95 transition-all shadow-lg"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLessons;
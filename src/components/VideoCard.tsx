
import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Pause } from "lucide-react";
import type { VideoReel } from '@/data/educationReels';

interface VideoCardProps {
  reel: VideoReel;
}

const VideoCard = ({ reel }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (reel.isYouTube) {
      setIsPlaying(true);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing video:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent className="p-0 aspect-video relative group">
        {reel.isYouTube ? (
          isPlaying ? (
            <iframe
              src={`${reel.videoUrl}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity"
                onClick={togglePlay}
              >
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
            </>
          )
        ) : (
          <>
            <video
              ref={videoRef}
              src={reel.videoUrl}
              className="w-full h-full object-cover"
              poster={reel.thumbnail}
              preload="metadata"
              onEnded={() => setIsPlaying(false)}
            />
            
            <div 
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-12 h-12 text-white" />
              ) : (
                <PlayCircle className="w-12 h-12 text-white" />
              )}
            </div>
          </>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white font-medium mb-1">{reel.title}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span>{reel.duration}</span>
            <span>•</span>
            <span>{reel.views} views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;


export interface VideoReel {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: string;
}

export const reels: VideoReel[] = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-programming-concept-with-person-typing-code-on-laptop-10364-large.mp4",
    duration: "2:30",
    views: "1.2k"
  },
  {
    id: 2,
    title: "JavaScript ES6 Features",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-on-her-laptop-42926-large.mp4",
    duration: "3:45",
    views: "856"
  },
  {
    id: 3,
    title: "CSS Grid Layout Tutorial",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-screen-with-data-4578-large.mp4",
    duration: "4:20",
    views: "2.1k"
  },
  {
    id: 4,
    title: "TypeScript Basics",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-source-code-10482-large.mp4",
    duration: "5:15",
    views: "1.5k"
  }
];

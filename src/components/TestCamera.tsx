
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface TestCameraProps {
  isTestSubmitted?: boolean;
}

const TestCamera = ({ isTestSubmitted = false }: TestCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Could not access camera');
        toast({
          title: "Camera Error",
          description: "Please enable camera access to continue with the test",
          variant: "destructive",
        });
      }
    };

    if (!isTestSubmitted) {
      startCamera();
    }

    return () => {
      // Clean up video stream when component unmounts or test is submitted
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, isTestSubmitted]);

  if (isTestSubmitted || error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 rounded-lg overflow-hidden shadow-lg border bg-background">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-[320px] h-[240px] object-cover"
      />
    </div>
  );
};

export default TestCamera;


import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface TestCameraProps {
  isTestSubmitted?: boolean;
}

const TestCamera = ({ isTestSubmitted = false }: TestCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
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

    // Start camera when component mounts and test is not submitted
    if (!isTestSubmitted) {
      startCamera();
    }
    
    // Stop camera when test is submitted or component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
        setStream(null);
      }
    };
  }, [toast, isTestSubmitted]);

  // Also explicitly stop the camera when isTestSubmitted changes to true
  useEffect(() => {
    if (isTestSubmitted && stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
      
      // Also clear the video element's srcObject
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [isTestSubmitted, stream]);

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

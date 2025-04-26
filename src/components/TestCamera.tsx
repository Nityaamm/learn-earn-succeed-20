
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

interface TestCameraProps {
  isTestSubmitted?: boolean;
}

const TestCamera = ({ isTestSubmitted = false }: TestCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  // Load model once
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (err) {
        setError('Could not load object detection model');
        toast({
          title: "Model Error",
          description: "Failed to load object detection model",
          variant: "destructive",
        });
      }
    };
    loadModel();
  }, [toast]);

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

    if (!isTestSubmitted) {
      startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
        setStream(null);
      }
    };
  }, [toast, isTestSubmitted]);

  // Handle test submission
  useEffect(() => {
    if (isTestSubmitted && stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      // Clear canvas when test is submitted
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }
  }, [isTestSubmitted, stream]);

  // Object detection loop
  useEffect(() => {
    let intervalId: NodeJS.Timer;

    const detectObjects = async () => {
      if (videoRef.current && model && canvasRef.current) {
        try {
          const predictions = await model.detect(videoRef.current);
          
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
            // Draw predictions
            predictions.forEach(prediction => {
              const [x, y, width, height] = prediction.bbox;
              ctx.strokeStyle = '#00FF00';
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, width, height);
              ctx.fillStyle = '#00FF00';
              ctx.font = '12px Arial';
              ctx.fillText(
                `${prediction.class} ${Math.round(prediction.score * 100)}%`,
                x, 
                y > 10 ? y - 5 : 10
              );
            });
          }
        } catch (err) {
          console.error('Object detection error:', err);
        }
      }
    };

    if (model && stream && !isTestSubmitted) {
      intervalId = setInterval(detectObjects, 200);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [model, stream, isTestSubmitted]);

  if (isTestSubmitted || error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 rounded-lg overflow-hidden shadow-lg border bg-background relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={320}
        height={240}
        className="absolute top-0 left-0 w-[320px] h-[240px] object-cover"
      />
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        className="absolute top-0 left-0 pointer-events-none"
      />
    </div>
  );
};

export default TestCamera;

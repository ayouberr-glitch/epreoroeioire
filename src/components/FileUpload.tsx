import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('فشل في الوصول إلى الكاميرا. يرجى التحقق من صلاحيات الكاميرا.');
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            onFileSelect(file);
            setPreview(canvas.toDataURL('image/jpeg'));
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    stopCamera();
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200",
          isDragActive ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-400",
          preview || isCameraActive ? "aspect-video" : "aspect-[4/3]"
        )}
      >
        <input {...getInputProps()} id="file-upload" />
        {isCameraActive ? (
          <div className="relative h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-x-4">
              <Button onClick={captureImage} variant="default">
                التقاط صورة
              </Button>
              <Button onClick={stopCamera} variant="destructive">
                إلغاء
              </Button>
            </div>
          </div>
        ) : preview ? (
          <div className="relative h-full group">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-contain"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearPreview();
                }}
                className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="rounded-full bg-blue-50 p-4">
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? "أفلت الملف هنا" : "اسحب وأفلت تقريرك الطبي"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                أو انقر لاختيار ملف من جهازك
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      {!preview && !isCameraActive && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            startCamera();
          }}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          <Camera className="w-5 h-5" />
          <span>التقاط صورة من الكاميرا</span>
        </Button>
      )}
    </div>
  );
};
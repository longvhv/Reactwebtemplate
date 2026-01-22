/**
 * Screenshot Capture Component
 * 
 * Allows users to capture screenshots of the current app pages
 * and attach them to usecases for documentation
 * 
 * Uses modern-screenshot for better CSS support including oklch colors
 */

import { useState } from 'react';
import { Camera, X, Check, Loader2 } from 'lucide-react';
import { domToPng } from 'modern-screenshot';

interface ScreenshotCaptureProps {
  onCapture: (screenshot: string) => void;
  buttonLabel?: string;
  className?: string;
}

export function ScreenshotCapture({ 
  onCapture, 
  buttonLabel = 'Chụp màn hình',
  className = ''
}: ScreenshotCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const captureScreenshot = async () => {
    setIsCapturing(true);

    try {
      // Wait a moment for UI to update
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get the main content area (skip modals and overlays)
      const targetElement = document.querySelector('main') || document.body;

      // Capture using modern-screenshot (supports oklch, CSS variables, etc.)
      const screenshot = await domToPng(targetElement as HTMLElement, {
        quality: 0.95,
        width: window.innerWidth,
        height: window.innerHeight,
        filter: (node) => {
          // Skip screenshot buttons and modals
          if (node instanceof Element) {
            return !node.classList.contains('screenshot-ignore');
          }
          return true;
        }
      });

      setCapturedImage(screenshot);
      setShowPreview(true);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      alert('Không thể chụp màn hình. Vui lòng thử lại sau.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setShowPreview(false);
      setCapturedImage(null);
    }
  };

  const handleCancel = () => {
    setShowPreview(false);
    setCapturedImage(null);
  };

  return (
    <>
      <button
        onClick={captureScreenshot}
        disabled={isCapturing}
        className={`screenshot-ignore inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isCapturing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang chụp...
          </>
        ) : (
          <>
            <Camera className="w-4 h-4" />
            {buttonLabel}
          </>
        )}
      </button>

      {/* Preview Modal */}
      {showPreview && capturedImage && (
        <div className="screenshot-ignore fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Xem trước ảnh chụp màn hình
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="flex-1 overflow-auto p-4">
              <img
                src={capturedImage}
                alt="Screenshot preview"
                className="w-full h-auto border border-gray-200 rounded-lg"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Sử dụng ảnh này
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Screenshot Gallery Component
 * Display captured screenshots in a grid
 */

interface ScreenshotGalleryProps {
  screenshots: string[];
  onRemove?: (index: number) => void;
  className?: string;
}

export function ScreenshotGallery({ 
  screenshots, 
  onRemove,
  className = '' 
}: ScreenshotGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {screenshots.map((screenshot, index) => (
          <div
            key={index}
            className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-500 transition-colors cursor-pointer"
            onClick={() => setSelectedImage(screenshot)}
          >
            <img
              src={screenshot}
              alt={`Screenshot ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">
                  Click để phóng to
                </span>
              </div>
            </div>

            {/* Remove button */}
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="screenshot-ignore absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Xóa ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Image number */}
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
              Ảnh {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="screenshot-ignore fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Screenshot fullscreen"
              className="w-full h-auto max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
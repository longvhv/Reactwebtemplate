/**
 * Screenshot Capture Modal Component
 * 
 * Opens related page in new window/tab and provides capture tools
 */

import { useState, useEffect } from 'react';
import { Camera, X, Check, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { domToPng } from 'modern-screenshot';

interface ScreenshotCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (screenshot: string) => void;
  targetUrl: string;
  usecaseTitle: string;
}

export function ScreenshotCaptureModal({ 
  isOpen, 
  onClose, 
  onCapture,
  targetUrl,
  usecaseTitle
}: ScreenshotCaptureModalProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [windowOpened, setWindowOpened] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null);
      setShowPreview(false);
      setWindowOpened(false);
    }
  }, [isOpen]);

  const handleOpenPage = () => {
    // Open page in new tab
    const newWindow = window.open(targetUrl, '_blank');
    if (newWindow) {
      setWindowOpened(true);
    } else {
      alert('Popup bị chặn. Vui lòng cho phép popup và thử lại.');
    }
  };

  const handleOpenInSameTab = () => {
    // Navigate in same tab
    window.location.href = targetUrl;
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
      setShowPreview(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setCapturedImage(null);
    setShowPreview(false);
  };

  if (!isOpen) return null;

  // Show preview if screenshot captured
  if (showPreview && capturedImage) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
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
    );
  }

  // Show instructions modal
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Chụp màn hình giao diện
            </h3>
            <p className="text-sm text-gray-600">
              {usecaseTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* URL Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 mb-1">
                  Trang cần chụp
                </p>
                <code className="text-sm bg-white px-3 py-1.5 rounded border border-blue-300 inline-block font-mono">
                  {targetUrl}
                </code>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              📋 Hướng dẫn chụp màn hình:
            </h4>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold text-indigo-600 flex-shrink-0">1.</span>
                <span>Click nút <strong>"Mở trang trong tab mới"</strong> bên dưới</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-indigo-600 flex-shrink-0">2.</span>
                <span>Tab mới sẽ mở với trang <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{targetUrl}</code></span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-indigo-600 flex-shrink-0">3.</span>
                <span>Sử dụng công cụ chụp màn hình của hệ điều hành:</span>
              </li>
              <li className="ml-8 space-y-1">
                <div>• <strong>Windows:</strong> Phím <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Win + Shift + S</kbd></div>
                <div>• <strong>Mac:</strong> Phím <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Cmd + Shift + 4</kbd></div>
                <div>• <strong>Browser:</strong> Devtools → ... → Screenshot</div>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-indigo-600 flex-shrink-0">4.</span>
                <span>Lưu file ảnh và upload vào usecase</span>
              </li>
            </ol>
          </div>

          {/* Alternative: Upload from file */}
          <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
            <p className="text-sm text-gray-700 mb-3">
              <strong>💡 Hoặc:</strong> Nếu bạn đã có sẵn screenshot, có thể upload trực tiếp:
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const base64 = event.target?.result as string;
                    setCapturedImage(base64);
                    setShowPreview(true);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>

          <div className="flex items-center gap-3">
            {!windowOpened && (
              <button
                onClick={handleOpenPage}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Mở trang trong tab mới
              </button>
            )}
            {windowOpened && (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Tab mới đã mở. Chụp màn hình và upload file ở trên.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple Screenshot Capture Button for external windows
 */

interface ExternalScreenshotCaptureProps {
  onCapture: (screenshot: string) => void;
  buttonLabel?: string;
  className?: string;
}

export function ExternalScreenshotCapture({ 
  onCapture, 
  buttonLabel = 'Chụp màn hình này',
  className = ''
}: ExternalScreenshotCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureCurrentPage = async () => {
    setIsCapturing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const targetElement = document.querySelector('main') || document.body;

      const screenshot = await domToPng(targetElement as HTMLElement, {
        quality: 0.95,
        width: window.innerWidth,
        height: window.innerHeight
      });

      onCapture(screenshot);
      
      // Show success message
      const overlay = document.createElement('div');
      overlay.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      overlay.textContent = '✓ Đã chụp màn hình thành công!';
      document.body.appendChild(overlay);
      
      setTimeout(() => {
        overlay.remove();
      }, 3000);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      alert('Không thể chụp màn hình. Vui lòng thử lại.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <button
      onClick={captureCurrentPage}
      disabled={isCapturing}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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
  );
}
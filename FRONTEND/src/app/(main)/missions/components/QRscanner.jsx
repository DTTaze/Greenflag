import React, { useEffect, useRef, useState } from "react";

export default function QRscanner({ onScan, onError, style }) {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState('Đang kiểm tra quyền truy cập camera...');

  const checkCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setMessage('Camera đã sẵn sàng. Vui lòng đưa mã QR vào khung hình');
    } catch (error) {
      setMessage('Vui lòng cấp quyền truy cập camera để sử dụng tính năng quét mã QR');
      console.error('Camera permission denied:', error);
      return false
    }
    return true
  };


  const hasPermission = checkCameraPermission()

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    
    if (!hasPermission) return;

    // @ts-ignore
    const scanner = new window.Html5QrcodeScanner("qr-reader", {
      fps: 5,
      qrbox: {
        width: 250,
        height: 250
      },
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
      aspectRatio: 1.0,
      verbose: false,
      videoConstraints: {
        facingMode: { ideal: "environment" },
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    });

    let scanCount = 0;
    const MAX_ERRORS_BEFORE_LOG = 30;

    const handleSuccess = (decodedText, decodedResult) => {
      console.log('QR Code detected:', decodedText);
      setMessage('Đã quét thành công!');
      setIsScanning(true);
      try {
        onScan(decodedText);
        scanner.pause();
      } catch (error) {
        console.error('Error in onScan callback:', error);
        setMessage('Có lỗi xảy ra khi xử lý mã QR');
        onError(error);
      }
    };

    const handleError = (errorMessage) => {
      scanCount++;
      if (scanCount % MAX_ERRORS_BEFORE_LOG === 0) {
        setMessage('Đang tìm mã QR... Vui lòng đưa mã QR vào khung hình và giữ camera ổn định');
      }
      
      if (!errorMessage.includes('No MultiFormat')) {
        setIsScanning(false);
        setMessage('Có lỗi với camera, vui lòng thử lại');
        onError(errorMessage);
      }
    };

    try {
      scanner.render(handleSuccess, handleError);
      scannerRef.current = scanner;
    } catch (error) {
      console.error('Error initializing scanner:', error);
      setMessage('Không thể khởi tạo camera');
      onError(error);
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error('Error cleaning up scanner:', error);
        }
      }
    };
  }, [onScan, onError]);

  const handleResume = () => {
    if (scannerRef.current) {
      scannerRef.current.resume();
      setIsScanning(false);
      setMessage('Đang tìm mã QR...');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        padding: '10px', 
        marginBottom: '10px', 
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#666'
      }}>
        {message}
      </div>
      
      {hasPermission && (
        <>
          <div id="qr-reader" style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto',
            border: '2px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            ...style 
          }}>
            <div id="qr-reader-results"></div>
          </div>
          {isScanning && (
            <button 
              onClick={handleResume}
              style={{
                margin: '10px',
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Quét tiếp
            </button>
          )}
        </>
      )}
    </div>
  );
}
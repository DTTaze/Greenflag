import React, { useEffect, useRef, useState } from "react";

export default function QRscanner({ onScan, onError, style }) {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState(
    "Đang kiểm tra quyền truy cập camera...",
  );
  const [hasPermission, setHasPermission] = useState(false);

  const checkCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setMessage("Camera đã sẵn sàng. Vui lòng đưa mã QR vào khung hình");
      setHasPermission(true);
      return true;
    } catch (error) {
      setMessage(
        "Vui lòng cấp quyền truy cập camera để sử dụng tính năng quét mã QR",
      );
      console.error("Camera permission denied:", error);
      setHasPermission(false);
      return false;
    }
  };

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
        height: 250,
      },
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
      aspectRatio: 1.0,
      verbose: false,
      videoConstraints: {
        facingMode: { ideal: "environment" },
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
      },
    });

    let scanCount = 0;
    const MAX_ERRORS_BEFORE_LOG = 30;

    const handleSuccess = (decodedText) => {
      console.log("QR Code detected:", decodedText);
      setMessage("Đã quét thành công!");
      setIsScanning(true);
      try {
        onScan(decodedText);
        scanner.pause();
      } catch (error) {
        console.error("Error in onScan callback:", error);
        setMessage("Có lỗi xảy ra khi xử lý mã QR");
        onError(error);
      }
    };

    const handleError = (errorMessage) => {
      scanCount++;
      if (scanCount % MAX_ERRORS_BEFORE_LOG === 0) {
        setMessage(
          "Đang tìm mã QR... Vui lòng đưa mã QR vào khung hình và giữ camera ổn định",
        );
      }

      if (!errorMessage.includes("No MultiFormat")) {
        setIsScanning(false);
        setMessage("Có lỗi với camera, vui lòng thử lại");
        onError(errorMessage);
      }
    };

    try {
      scanner.render(handleSuccess, handleError);
      scannerRef.current = scanner;
    } catch (error) {
      console.error("Error initializing scanner:", error);
      setMessage("Không thể khởi tạo camera");
      onError(error);
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error("Error cleaning up scanner:", error);
        }
      }
    };
  }, [hasPermission, onScan, onError]);

  const handleResume = () => {
    if (scannerRef.current) {
      scannerRef.current.resume();
      setIsScanning(false);
      setMessage("Đang tìm mã QR...");
    }
  };

  return (
    <div className="w-full text-center">
      <div className="mb-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {message}
      </div>

      {hasPermission && (
        <div className="space-y-4">
          <div
            id="qr-reader"
            className="mx-auto w-full max-w-[400px] overflow-hidden rounded-xl border border-gray-200 bg-black shadow-2xs"
            style={style}
          >
            <div id="qr-reader-results"></div>
          </div>
          {isScanning && (
            <button
              onClick={handleResume}
              className="cursor-pointer rounded-xl bg-[#0B6E4F] px-5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#0D7F5C] active:scale-95"
            >
              Quét tiếp
            </button>
          )}
        </div>
      )}
    </div>
  );
}

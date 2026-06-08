import { useEffect, useState } from "react";

import { getQR } from "../../utils/api";

export default function QRCodeDisplay({ initialText }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      if (initialText) {
        try {
          const response = await getQR(initialText);
          console.log("qr response: ", response);
          setQr(response.data);
        } catch (error) {
          console.error("Error generating QR:", error);
        }
      }
    };

    generateQR();
  }, [initialText]);

  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
      {qr && (
        <img
          src={qr}
          alt="QR Code"
          className="h-64 w-64 rounded-lg border-2 border-gray-200 object-contain shadow-md"
        />
      )}
    </div>
  );
}

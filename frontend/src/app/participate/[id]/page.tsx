"use client";

import Wrapper from "@/components/Wrapper";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ParticipateDetail() {
  const { id } = useParams();
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScan = (result: unknown) => {
    console.log("!!!", result);
    if (result) {
      console.log("Scanned Data:", result);
      setScannedData(result as string); // QR 코드 데이터를 상태에 저장
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      if (error.name === "NotFoundException") {
        console.warn(
          "QR code not found. Please ensure the QR code is visible."
        );
      } else {
        console.error("Error scanning QR code:", error);
      }
    }
  };

  return (
    <Wrapper>
      <div className="mx-20 mt-20">
        <h1>Event ID: {id}</h1>
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (result) handleScan(result);
            if (error) handleError(error);
          }}
        />
        {scannedData === null ? (
          <p>Align the QR code within the frame to scan.</p>
        ) : (
          <p>Scanned Data: {scannedData}</p>
        )}
      </div>
    </Wrapper>
  );
}

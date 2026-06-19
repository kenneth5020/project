"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const [status, setStatus] = useState("카메라를 준비하는 중입니다...");
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let controls: { stop: () => void } | undefined;

    async function startScanner() {
      try {
        setStatus("바코드를 카메라 중앙에 맞춰주세요.");

        controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result) => {
            if (result && !isScanned) {
              const barcode = result.getText();

              setIsScanned(true);
              setStatus(`인식 완료: ${barcode}`);

              controls?.stop();
              router.push(`/product/${barcode}`);
            }
          }
        );
      } catch (error) {
        setStatus("카메라 실행에 실패했습니다. 카메라 권한을 허용해주세요.");
      }
    }

    startScanner();

    return () => {
      controls?.stop();
    };
  }, [router, isScanned]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">바코드 스캔</h1>
      <p className="text-gray-400 mb-6">{status}</p>

      <div className="relative overflow-hidden rounded-3xl border border-lime-400">
        <video
          ref={videoRef}
          className="w-full aspect-[3/4] object-cover bg-neutral-900"
        />

        <div className="absolute left-8 right-8 top-1/2 h-1 bg-lime-400 rounded-full" />
      </div>

      <p className="mt-6 text-sm text-gray-500">
        밝은 곳에서 바코드를 초록색 선에 맞춰주세요.
      </p>
    </main>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const [status, setStatus] = useState("카메라를 준비하는 중입니다...");
  const [manualBarcode, setManualBarcode] = useState("8801234567890");
  const [lastCode, setLastCode] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    let controls: { stop: () => void } | undefined;
    let alreadyScanned = false;

    async function startScanner() {
      try {
        if (
          window.location.protocol !== "https:" &&
          window.location.hostname !== "localhost"
        ) {
          setStatus(
            "스마트폰 카메라는 HTTPS 환경에서만 안정적으로 동작합니다. Vercel 주소로 접속해주세요."
          );
          return;
        }

        if (!videoRef.current) {
          setStatus("비디오 화면을 준비하지 못했습니다.");
          return;
        }

        setStatus("카메라 권한을 허용해주세요.");

        controls = await codeReader.decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          },
          videoRef.current,
          (result, error) => {
            if (result && !alreadyScanned) {
              alreadyScanned = true;

              const barcode = result.getText();
              setLastCode(barcode);
              setStatus(`바코드 인식 완료: ${barcode}`);

              controls?.stop();

              setTimeout(() => {
                router.push(`/product/${barcode}`);
              }, 500);
            }
          }
        );

        setStatus("바코드를 화면 중앙 초록색 선에 맞춰주세요.");
      } catch (error) {
        console.error(error);
        setStatus("카메라 실행에 실패했습니다. 권한 또는 브라우저 설정을 확인해주세요.");
      }
    }

    startScanner();

    return () => {
      controls?.stop();
    };
  }, [router]);

  function goToProduct() {
    if (!manualBarcode.trim()) {
      alert("바코드 번호를 입력해주세요.");
      return;
    }

    router.push(`/product/${manualBarcode.trim()}`);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">바코드 스캔</h1>
      <p className="text-gray-400 mb-6">{status}</p>

      <div className="relative overflow-hidden rounded-3xl border border-lime-400 bg-neutral-900">
        <video
          ref={videoRef}
          className="w-full aspect-[3/4] object-cover"
          autoPlay
          muted
          playsInline
        />

        <div className="absolute left-8 right-8 top-1/2 h-1 bg-lime-400 rounded-full shadow-lg shadow-lime-400/50" />

        <div className="absolute inset-x-8 top-[35%] bottom-[35%] border-2 border-lime-400/60 rounded-2xl pointer-events-none" />
      </div>

      {lastCode && (
        <p className="mt-4 text-lime-400 text-sm">
          마지막 인식값: {lastCode}
        </p>
      )}

      <p className="mt-6 text-sm text-gray-500 leading-6">
        바코드를 너무 가까이 대지 말고, 화면 중앙 사각형 안에 가로 방향으로 맞춰주세요.
        초점이 잡힐 때까지 10~20cm 정도 거리를 조절해보세요.
      </p>

      <section className="mt-8 rounded-3xl bg-neutral-900 p-5 border border-neutral-800">
        <h2 className="text-lg font-bold mb-3">직접 입력 테스트</h2>

        <input
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value)}
          className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-3 text-white"
          placeholder="바코드 번호 입력"
        />

        <button
          onClick={goToProduct}
          className="mt-4 w-full rounded-full bg-lime-400 text-black font-bold py-3"
        >
          제품 결과 보기
        </button>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => router.push("/product/8801234567890")}
            className="flex-1 rounded-xl bg-neutral-800 py-3 text-sm"
          >
            단백질바 테스트
          </button>

          <button
            onClick={() => router.push("/product/8809876543210")}
            className="flex-1 rounded-xl bg-neutral-800 py-3 text-sm"
          >
            음료 테스트
          </button>
        </div>
      </section>
    </main>
  );
}
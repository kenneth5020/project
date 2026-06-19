import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <p className="text-sm text-lime-400 mb-4">HINDSIGHT+ BETA</p>

      <h1 className="text-4xl font-bold leading-tight">
        성분을 알면
        <br />
        선택이 달라진다.
      </h1>

      <p className="mt-4 text-gray-400">
        바코드를 스캔해서 제품의 영양성분을 확인합니다.
      </p>

      <Link
        href="/scan"
        className="mt-8 inline-block rounded-full bg-lime-400 px-6 py-3 text-black font-bold"
      >
        바코드 스캔해서 제품 분석
      </Link>
    </main>
  );
}
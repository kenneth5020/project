import { NextResponse } from "next/server";

const products = [
  {
    barcode: "8801234567890",
    name: "단백질바 초코맛",
    brand: "HINDSIGHT 테스트",
    category: "식품/가공식품",
    score: 82,
    nutrition: {
      calories: 210,
      carbohydrate: 24,
      sugar: 8,
      protein: 15,
      fat: 7,
      saturatedFat: 3,
      sodium: 180,
    },
  },
  {
    barcode: "8809876543210",
    name: "제로 탄산음료",
    brand: "HINDSIGHT 테스트",
    category: "음료",
    score: 90,
    nutrition: {
      calories: 0,
      carbohydrate: 0,
      sugar: 0,
      protein: 0,
      fat: 0,
      saturatedFat: 0,
      sodium: 35,
    },
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  const product = products.find((item) => item.barcode === barcode);

  if (!product) {
    return NextResponse.json({
      found: false,
      barcode: barcode,
      message: "등록되지 않은 제품입니다.",
    });
  }

  return NextResponse.json({
    found: true,
    product,
  });
}
type ProductPageProps = {
  params: Promise<{
    barcode: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { barcode } = await params;

  const res = await fetch(
    `http://localhost:3000/api/products/barcode/${barcode}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!data.found) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-8">
        <p className="text-lime-400 text-sm mb-4">SCAN RESULT</p>

        <h1 className="text-2xl font-bold mb-4">등록되지 않은 제품입니다</h1>

        <p className="text-gray-400 mb-2">바코드: {barcode}</p>
        <p className="text-gray-500">
          현재 DB에 없는 제품입니다. 추후 영양성분표 사진 등록 기능으로
          데이터를 추가할 수 있습니다.
        </p>
      </main>
    );
  }

  const product = data.product;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <p className="text-lime-400 text-sm mb-4">SCAN RESULT</p>

      <section className="rounded-3xl bg-neutral-900 p-6 border border-neutral-800">
        <p className="text-sm text-gray-400">{product.category}</p>

        <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
        <p className="text-gray-400 mt-1">{product.brand}</p>
        <p className="text-gray-500 mt-1">바코드: {product.barcode}</p>

        <div className="mt-6 flex items-end gap-2">
          <span className="text-5xl font-bold text-lime-400">
            {product.score}
          </span>
          <span className="text-gray-400 mb-2">점</span>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">영양성분</h2>

        <div className="grid grid-cols-2 gap-3">
          <NutritionCard
            label="열량"
            value={`${product.nutrition.calories} kcal`}
          />
          <NutritionCard
            label="탄수화물"
            value={`${product.nutrition.carbohydrate} g`}
          />
          <NutritionCard
            label="당류"
            value={`${product.nutrition.sugar} g`}
          />
          <NutritionCard
            label="단백질"
            value={`${product.nutrition.protein} g`}
          />
          <NutritionCard
            label="지방"
            value={`${product.nutrition.fat} g`}
          />
          <NutritionCard
            label="포화지방"
            value={`${product.nutrition.saturatedFat} g`}
          />
          <NutritionCard
            label="나트륨"
            value={`${product.nutrition.sodium} mg`}
          />
        </div>
      </section>
    </main>
  );
}

function NutritionCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-neutral-900 p-4 border border-neutral-800">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
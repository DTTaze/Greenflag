import { Leaf } from "lucide-react";

import CoinBalance from "./CoinBalance";

function CatalogHeader({ userCoins }) {
  return (
    <div className="mb-8 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 shadow-md">
      <h1 className="mb-3 flex items-center text-2xl font-bold text-white md:text-3xl">
        <Leaf className="mr-2 h-6 w-6" />
        Trung tâm trao đổi xanh
      </h1>
      <p className="mb-6 max-w-2xl text-emerald-50">
        Chuyển đổi coins của bạn thành các vật phẩm bền vững và thân thiện với
        môi trường.
      </p>
      <CoinBalance coins={userCoins} />
    </div>
  );
}

export default CatalogHeader;

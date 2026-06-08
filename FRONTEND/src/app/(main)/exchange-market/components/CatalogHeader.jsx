import { Leaf } from "lucide-react";
import CoinBalance from "./CoinBalance";

function CatalogHeader({ userCoins }) {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-6 mb-8 shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center">
        <Leaf className="h-6 w-6 mr-2" />
        Trung tâm trao đổi xanh
      </h1>
      <p className="text-emerald-50 mb-6 max-w-2xl">
        Chuyển đổi coins của bạn thành các vật phẩm bền vững và thân thiện với môi trường.
      </p>
      <CoinBalance coins={userCoins} />
    </div>
  );
}

export default CatalogHeader;
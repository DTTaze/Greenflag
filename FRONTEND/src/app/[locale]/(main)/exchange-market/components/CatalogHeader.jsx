import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

import CoinBalance from "./CoinBalance";

function CatalogHeader({ userCoins }) {
  return (
    <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-700 via-emerald-600 to-[#0B6E4F] p-7 text-white shadow-md">
      <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 flex items-center text-2xl font-extrabold tracking-tight md:text-3xl">
            <motion.span
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mr-2.5 inline-block"
            >
              <Leaf className="h-7 w-7 fill-emerald-200/10 text-emerald-200" />
            </motion.span>
            Trung tâm trao đổi xanh
          </h1>
          <p className="max-w-xl text-sm leading-relaxed font-medium text-emerald-100 opacity-90 md:text-base">
            Chuyển đổi coins của bạn thành các vật phẩm bền vững và thân thiện
            với môi trường.
          </p>
        </div>
      </div>
      <div className="max-w-2xl">
        <CoinBalance coins={userCoins} />
      </div>
    </div>
  );
}

export default CatalogHeader;

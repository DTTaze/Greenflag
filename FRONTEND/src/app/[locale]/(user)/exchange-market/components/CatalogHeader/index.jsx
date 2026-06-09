import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import React from "react";

import CoinBalance from "../CoinBalance";

function CatalogHeader({ userCoins }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0B6E4F] via-[#0d7353] to-[#054E37] p-7 text-white shadow-xl flex flex-col justify-between gap-6">
      {/* Decorative backdrop glow */}
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-[#129A72]/20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 flex items-center gap-2.5 text-2xl font-extrabold tracking-tight md:text-3xl">
            <motion.span
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20"
            >
              <Leaf className="h-5 w-5 text-emerald-250 animate-pulse" />
            </motion.span>
            Trung tâm trao đổi xanh
          </h1>
          <p className="max-w-xl text-sm md:text-[0.95rem] leading-relaxed font-medium text-emerald-100/90">
            Chuyển đổi coins tích lũy của bạn thành các vật phẩm bền vững và thân thiện với môi trường.
          </p>
        </div>
      </div>
      <div className="relative z-10 max-w-2xl">
        <CoinBalance coins={userCoins} />
      </div>
    </div>
  );
}

export default CatalogHeader;

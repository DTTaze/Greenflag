import { motion } from "framer-motion";
import { ArrowRight, Gift, Leaf, Sparkles } from "lucide-react";
import React, { useContext } from "react";

import GlobalSearchBar from "@/src/components/common/GlobalSearchBar";
import { MarketplaceContext } from "../../layout";

function CatalogHeader({ userCoins }) {
  const { marketSearchText, setMarketSearchText } = useContext(MarketplaceContext) || {};

  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative mb-7 overflow-hidden rounded-[2rem] border border-emerald-200/40 bg-gradient-to-br from-[#064E3B] via-[#0B6E4F] to-[#10B981] p-6 text-white shadow-[0_24px_70px_rgba(6,78,59,0.24)] sm:p-8"
    >
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-lime-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.12)_45%,transparent_65%)]" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-50 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-lime-200" />
            Đổi coin xanh - nhận quà bền vững
          </motion.div>

          <h1 className="mb-3 flex items-center gap-3 text-2xl font-black tracking-tight md:text-4xl">
            <motion.span
              whileHover={{ rotate: 14, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 320, damping: 14 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-md"
            >
              <Leaf className="h-6 w-6 text-lime-100" />
            </motion.span>
            Trung tâm trao đổi xanh
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed font-medium text-emerald-50/90 md:text-base">
            Khám phá vật phẩm thân thiện môi trường, quản lý sản phẩm của bạn và
            đổi coins tích lũy trong vài thao tác đơn giản.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-emerald-50">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 ring-1 ring-white/15 backdrop-blur-md">
              <Gift className="h-4 w-4 text-lime-200" />
              Quà xanh chọn lọc
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 ring-1 ring-white/15 backdrop-blur-md">
              Giao dịch dễ dàng
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="flex w-full sm:min-w-[320px]">
          <GlobalSearchBar
            value={marketSearchText || ""}
            onChange={setMarketSearchText}
            placeholder="Tìm sản phẩm xanh, người bán..."
            aria-label="Tìm kiếm sản phẩm"
          />
        </div>
      </div>
    </motion.header>
  );
}

export default CatalogHeader;

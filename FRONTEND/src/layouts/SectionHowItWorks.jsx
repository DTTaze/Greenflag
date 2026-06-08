"use client";

import { Compass, Gift, UserPlus } from "lucide-react";
import React from "react";

export default function SectionHowItWorks() {
  const steps = [
    {
      step: "01",
      icon: (
        <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Đăng ký tài khoản",
      desc: "Tham gia cộng đồng Green Flag hoàn toàn miễn phí và bắt đầu thiết lập thói quen sống bền vững.",
    },
    {
      step: "02",
      icon: (
        <Compass className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Làm nhiệm vụ bảo vệ môi trường",
      desc: "Lựa chọn các thử thách hằng ngày như nhặt rác nhựa, trồng cây xanh, xem video kiến thức để tích lũy EcoCoins.",
    },
    {
      step: "03",
      icon: <Gift className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Đổi quà tặng hấp dẫn",
      desc: "Sử dụng số EcoCoins tích lũy tại Chợ trao đổi để sở hữu các sản phẩm thân thiện với môi trường.",
    },
  ];

  return (
    <section className="bg-zinc-50/70 py-20 dark:bg-zinc-900/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-sm font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
            Quy trình tham gia
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Bắt đầu hành trình sống xanh chỉ với 3 bước
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50"
            >
              <div className="absolute top-4 right-6 text-5xl font-black text-emerald-500/10 dark:text-emerald-500/5">
                {item.step}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                {item.icon}
              </div>
              <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Award, Globe, Shield } from "lucide-react";
import React from "react";

import SectionFeatures from "./SectionFeatures";
import SectionHero from "./SectionHero";
import SectionHowItWorks from "./SectionHowItWorks";

function HomepageSection() {
  return (
    <div className="bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <SectionHero />

      <SectionHowItWorks />

      {/* Feature 1: Missions */}
      <SectionFeatures
        badge="Nhiệm vụ xanh"
        imagePath="/images/Nhiemvu.png"
        H2Text="Hoàn thành nhiệm vụ, tích lũy điểm xanh"
        PText="Khám phá danh sách các hành động thiết thực hằng ngày. Từ việc nhặt rác nhựa, trồng cây xanh, tiết kiệm điện nước đến việc xem video học hỏi kiến thức môi trường. Hoàn thành thử thách để nhận EcoCoins và góp phần xây dựng hành tinh trong lành hơn!"
        path="/missions"
        ButtonText="Khám phá nhiệm vụ"
      />

      {/* Feature 2: Market */}
      <SectionFeatures
        badge="Đổi quà bền vững"
        imagePath="/images/Cho-trao-doi.png"
        H2Text="Chợ Trao Đổi - Biến điểm thành hành động thực tế"
        PText="Nhận phần thưởng xứng đáng cho nỗ lực của bạn. Sử dụng EcoCoins để quy đổi sang các sản phẩm xanh bền vững, ống hút sinh học, túi tự hủy hoặc các voucher xanh hữu ích từ đối tác liên kết của Green Flag."
        path="/exchange-market"
        ButtonText="Khám phá chợ trao đổi"
        reverse
      />

      {/* Feature 3: Community */}
      <SectionFeatures
        badge="Mạng xã hội"
        imagePath="/images/hand-drawn-people-planting-a-tree.jpg"
        H2Text="Kết nối cộng đồng - Lan tỏa thói quen văn minh"
        PText="Chia sẻ hình ảnh hoạt động bảo vệ môi trường của bạn lên bảng tin cộng đồng. Thảo luận, tương tác, thả tim và bình luận cổ vũ hành động của mọi người để cùng nhau thắp sáng những thông điệp tích cực nhất!"
        path="/community"
        ButtonText="Tham gia cộng đồng ngay"
      />

      {/* Trust & Guarantee Section */}
      <section className="border-t border-zinc-100 bg-zinc-50/30 py-16 dark:border-zinc-900 dark:bg-zinc-950/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Globe size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                  Tác động toàn cầu
                </h4>
                <p className="text-zinc-550 mt-1 text-sm dark:text-zinc-400">
                  Mọi đóng góp nhỏ của bạn tích tiểu thành đại, giải quyết các
                  vấn đề biến đổi khí hậu trên thế giới.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Shield size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                  Minh bạch, bảo mật
                </h4>
                <p className="text-zinc-550 mt-1 text-sm dark:text-zinc-400">
                  Quy trình duyệt nhiệm vụ và giao dịch EcoCoins diễn ra tự động
                  và rõ ràng qua bảng kiểm duyệt hệ thống.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Award size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                  Sản phẩm chất lượng
                </h4>
                <p className="text-zinc-550 mt-1 text-sm dark:text-zinc-400">
                  Các phần quà tại Chợ trao đổi được kiểm tra nghiêm ngặt về
                  nguồn gốc sinh học và chứng nhận thân thiện môi trường.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomepageSection;

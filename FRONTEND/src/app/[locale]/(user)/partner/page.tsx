"use client";

import {
  Award,
  Calendar,
  ChevronRight,
  Gift,
  Plus,
  QrCode,
  TrendingUp,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Link } from "@/src/i18n/navigation";
import { eventServices } from "@/src/services/event";

export default function PartnerPage() {
  const t = useTranslations("partner");
  const locale = useLocale();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await eventServices.partnerGetMyEvents();
        if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Lỗi khi tải sự kiện đối tác:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const totalEvents = events.length;
  const activeEvents = events.filter((evt) => {
    // Assuming active if status is not 'ended' or simply active.
    // If status is not in the object, assume active.
    return evt.status !== "ended";
  }).length;

  const mockRedemptions = 320;
  const mockPoints = 12450;

  const metrics = [
    {
      label: locale === "vi" ? "Tổng sự kiện" : "Total Events",
      value: totalEvents,
      change: "+2 tháng này",
      icon: (
        <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      ),
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      label: locale === "vi" ? "Sự kiện hoạt động" : "Active Events",
      value: activeEvents,
      change: "Đang diễn ra",
      icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: locale === "vi" ? "Lượt đổi quà" : "Total Redemptions",
      value: mockRedemptions,
      change: "+12% tuần này",
      icon: <Gift className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      label: locale === "vi" ? "Tổng điểm đã đổi" : "Points Exchanged",
      value: `${mockPoints.toLocaleString()} pts`,
      change: "Tích lũy xanh",
      icon: <Award className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
      bg: "bg-violet-50 dark:bg-violet-950/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {locale === "vi" ? "Tổng quan hoạt động" : "Activity Dashboard"}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            {locale === "vi"
              ? "Theo dõi tác động, hiệu quả và kết quả chiến dịch môi trường của bạn."
              : "Track the impact, effectiveness, and results of your green campaigns."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/partner/scanner">
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-2xl border-gray-200 dark:border-zinc-800"
            >
              <QrCode className="mr-2 h-4 w-4" />
              {locale === "vi" ? "Quét QR Điểm danh" : "Check-in Scanner"}
            </Button>
          </Link>
          <Link href="/partner/events">
            <Button
              size="sm"
              className="h-10 rounded-2xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              {locale === "vi" ? "Tạo sự kiện" : "New Event"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="group hover:border-emerald-250 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
                {m.label}
              </span>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${m.bg}`}
              >
                {m.icon}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {m.value}
              </h3>
              <p className="mt-1 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                {m.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Events & Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Events Table Overview */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs lg:col-span-2 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {locale === "vi" ? "Sự kiện mới đây" : "Recent Events"}
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                {locale === "vi"
                  ? "Danh sách các chiến dịch đã tổ chức gần nhất."
                  : "List of your most recently organized campaigns."}
              </p>
            </div>
            <Link
              href="/partner/events"
              className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {locale === "vi" ? "Xem tất cả" : "View all"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="animate-pulse py-8 text-center text-sm text-gray-500">
                {locale === "vi" ? "Đang tải dữ liệu..." : "Loading data..."}
              </div>
            ) : events.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                {locale === "vi"
                  ? "Bạn chưa tạo sự kiện nào."
                  : "You have no events organized yet."}
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:border-zinc-800 dark:text-zinc-500">
                    <th className="pr-4 pb-3">
                      {locale === "vi" ? "Tên sự kiện" : "Event Title"}
                    </th>
                    <th className="pr-4 pb-3">
                      {locale === "vi" ? "Ngày diễn ra" : "Date"}
                    </th>
                    <th className="pr-4 pb-3">
                      {locale === "vi" ? "Trạng thái" : "Status"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {events.slice(0, 5).map((evt) => {
                    const statusClass =
                      evt.status === "ended"
                        ? "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

                    const dateStr =
                      evt.start_time || evt.startTime
                        ? new Date(
                            evt.start_time || evt.startTime,
                          ).toLocaleDateString(
                            locale === "en" ? "en-US" : "vi-VN",
                          )
                        : "N/A";

                    return (
                      <tr
                        key={evt.id}
                        className="group/row text-gray-700 dark:text-zinc-300"
                      >
                        <td className="max-w-[180px] truncate py-3.5 pr-4 font-semibold text-gray-900 dark:text-white">
                          {evt.title || evt.name}
                        </td>
                        <td className="py-3.5 pr-4 text-xs font-medium text-gray-500 dark:text-zinc-400">
                          {dateStr}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase ${statusClass}`}
                          >
                            {evt.status === "ended"
                              ? locale === "vi"
                                ? "Kết thúc"
                                : "Ended"
                              : locale === "vi"
                                ? "Đang chạy"
                                : "Active"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Info panel or Tips */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {locale === "vi" ? "Hướng dẫn & Mẹo" : "Guide & Tips"}
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/10">
              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                1. {locale === "vi" ? "Tổ chức sự kiện" : "Host Events"}
              </h3>
              <p className="text-slate-650 mt-1 text-xs dark:text-zinc-400">
                {locale === "vi"
                  ? "Tạo sự kiện môi trường để thu hút cộng đồng tham gia và phát hành mã QR điểm danh."
                  : "Create environmental events to engage the community and issue check-in QR codes."}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/10">
              <h3 className="text-sm font-bold text-blue-800 dark:text-blue-400">
                2. {locale === "vi" ? "Quản lý tồn kho" : "Manage Inventory"}
              </h3>
              <p className="text-slate-650 mt-1 text-xs dark:text-zinc-400">
                {locale === "vi"
                  ? "Cung cấp các phần quà hấp dẫn trong kho hàng của bạn để khuyến khích cộng đồng đổi điểm."
                  : "Provide attractive items in your inventory to encourage community members to redeem points."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Link } from "@/src/i18n/navigation";
import { usePartnerTransactionsQuery } from "@/src/queries/commerce/QueryHooksCommerce";
import { usePartnerEventsQuery } from "@/src/queries/event/QueryHooksEvent";
import { EVENT_STATUS } from "@/src/types/event/event.type";

export default function PartnerPage() {
  const t = useTranslations("partner");
  const locale = useLocale();

  const { data: eventsRes, isLoading: isEventsLoading } =
    usePartnerEventsQuery();
  const { data: transactionsRes, isLoading: isTransactionsLoading } =
    usePartnerTransactionsQuery();

  const events = Array.isArray(eventsRes) ? eventsRes : [];

  const transactions = Array.isArray(transactionsRes) ? transactionsRes : [];

  const loading = isEventsLoading || isTransactionsLoading;

  const totalEvents = events.length;
  const activeEvents = events.filter((evt) => {
    return evt.status !== EVENT_STATUS.FINISHED;
  }).length;

  const successfulTransactions = transactions.filter((tx) => {
    const status = tx.status?.toLowerCase();
    return (
      status === "accepted" ||
      status === "completed" ||
      status === "shipped" ||
      status === "delivered"
    );
  });

  const totalRedemptions = successfulTransactions.length;
  const pointsExchanged = successfulTransactions.reduce(
    (sum, tx) => sum + (tx.totalPrice || 0),
    0,
  );

  const metrics = [
    {
      label: t("overview.totalEvents"),
      value: totalEvents,
      change: t("overview.thisMonth"),
      icon: (
        <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      ),
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      label: t("overview.activeEvents"),
      value: activeEvents,
      change: t("overview.ongoing"),
      icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: t("overview.totalRedemptions"),
      value: totalRedemptions,
      change: t("overview.thisWeek"),
      icon: <Gift className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      label: t("overview.pointsExchanged"),
      value: `${pointsExchanged.toLocaleString()} pts`,
      change: t("overview.greenAccumulation"),
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
            {t("overview.title")}
          </h1>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-zinc-400">
            {t("overview.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/partner/scanner">
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-2xl border-emerald-200 bg-white/70 font-bold text-emerald-800 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/30 dark:bg-slate-900/50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
            >
              <QrCode className="mr-2 h-4 w-4" />
              {t("overview.scanQr")}
            </Button>
          </Link>
          <Link href="/partner/events">
            <Button
              size="sm"
              className="h-10 rounded-2xl bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/10 transition-all duration-300 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:shadow-none dark:hover:bg-emerald-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("overview.createEvent")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, idx) => (
          <Card
            key={idx}
            className="group hover:border-emerald-355 relative overflow-hidden rounded-3xl border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(16,185,129,0.08)] dark:border-emerald-500/20 dark:bg-slate-900/80 dark:hover:border-emerald-500/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                {m.label}
              </span>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${m.bg}`}
              >
                {m.icon}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {m.value}
              </h3>
              <p className="mt-2 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                {m.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid: Recent Events & Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Events Table Overview */}
        <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl lg:col-span-2 dark:border-emerald-500/20 dark:bg-slate-900/80">
          <CardHeader className="mb-6 flex flex-row items-center justify-between p-0">
            <div>
              <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
                {t("overview.recentEvents")}
              </CardTitle>
              <CardDescription className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                {t("overview.recentEventsDesc")}
              </CardDescription>
            </div>
            <Link
              href="/partner/events"
              className="inline-flex items-center text-xs font-bold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {t("overview.viewAll")}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>

          <CardContent className="overflow-x-auto p-0">
            {loading ? (
              <div className="flex h-32 items-center justify-center text-center text-sm text-gray-500 dark:text-slate-400">
                <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                {t("overview.loading")}
              </div>
            ) : events.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-center text-sm text-gray-500 dark:text-slate-400">
                {t("overview.noEvents")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-emerald-100 dark:border-emerald-950/45">
                    <TableHead className="pl-0 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                      {t("overview.eventTitle")}
                    </TableHead>
                    <TableHead className="text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                      {t("overview.eventDate")}
                    </TableHead>
                    <TableHead className="pr-0 text-right text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                      {t("overview.eventStatus")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.slice(0, 5).map((evt) => {
                    const isEnded = evt.status === EVENT_STATUS.FINISHED;
                    const dateStr = evt.startTime
                      ? new Date(evt.startTime).toLocaleDateString(
                          locale === "en" ? "en-US" : "vi-VN",
                        )
                      : "N/A";

                    return (
                      <TableRow
                        key={evt.id}
                        className="border-b border-emerald-50/30 transition-colors hover:bg-emerald-50/20 dark:border-emerald-950/20 dark:hover:bg-emerald-950/10"
                      >
                        <TableCell className="max-w-[180px] truncate py-3.5 pl-0 font-bold text-gray-900 dark:text-white">
                          {evt.title}
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-semibold text-gray-500 dark:text-slate-400">
                          {dateStr}
                        </TableCell>
                        <TableCell className="py-3.5 pr-0 text-right">
                          <Badge
                            className={
                              isEnded
                                ? "dark:text-zinc-350 border-none bg-gray-100 text-gray-700 shadow-none hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                                : "border-none bg-emerald-100 text-emerald-800 shadow-none hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                            }
                          >
                            {isEnded
                              ? t("overview.statusEnded")
                              : t("overview.statusActive")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Info panel or Tips */}
        <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl dark:border-emerald-500/20 dark:bg-slate-900/80">
          <CardHeader className="mb-6 p-0">
            <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
              {t("overview.guideTips")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            <div className="group/item rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 transition-all duration-300 hover:bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20">
              <h3 className="text-sm font-bold text-emerald-800 transition-colors group-hover/item:text-emerald-600 dark:text-emerald-400 dark:group-hover/item:text-emerald-300">
                {t("overview.tipHostTitle")}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {t("overview.tipHostDesc")}
              </p>
            </div>

            <div className="group/item rounded-2xl border border-blue-100 bg-blue-50/30 p-4 transition-all duration-300 hover:bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-950/10 dark:hover:bg-blue-950/20">
              <h3 className="text-sm font-bold text-blue-800 transition-colors group-hover/item:text-blue-600 dark:text-blue-400 dark:group-hover/item:text-blue-300">
                {t("overview.tipInventoryTitle")}
              </h3>
              <p className="text-slate-650 mt-1.5 text-xs leading-relaxed dark:text-slate-400">
                {t("overview.tipInventoryDesc")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

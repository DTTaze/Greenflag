import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { EventType } from "@/src/types/event/event.type";
import { UserType } from "@/src/types/user/user.type";

interface ScannerConfigPanelProps {
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  loadingEvents: boolean;
  scannedResult: string;
  scannedUser: UserType | null;
  onReset: () => void;
}

export function ScannerConfigPanel({
  events,
  selectedEventId,
  setSelectedEventId,
  loadingEvents,
  scannedResult,
  scannedUser,
  onReset,
}: ScannerConfigPanelProps) {
  const t = useTranslations("partner");

  return (
    <Card className="flex flex-col justify-between rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
          {t("scanner.panelTitle")}
        </CardTitle>
        <CardDescription className="mt-1.5 text-sm text-gray-600 dark:text-slate-400">
          {t("scanner.panelDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6 flex-1">
          {loadingEvents ? (
            <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mr-2" />
              {t("scanner.loading")}
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 p-4 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
              <p className="text-sm font-semibold">
                {t("scanner.noEventsTitle")}
              </p>
              <p className="mt-1 text-xs">
                {t("scanner.noEventsDesc")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t("scanner.selectEvent")}
                <div className="mt-2">
                  <Select
                    value={selectedEventId}
                    onValueChange={(val) => setSelectedEventId(val || "")}
                  >
                    <SelectTrigger className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-800/30 dark:bg-gray-950 dark:text-gray-100 h-auto flex justify-between items-center">
                      <SelectValue placeholder={t("scanner.selectEvent")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900 border border-emerald-200/50 dark:border-emerald-500/20">
                      {events.map((evt) => (
                        <SelectItem key={evt.id} value={evt.id}>
                          {evt.title || evt.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </label>
            </div>
          )}

          {/* Scan Result Logs */}
          {scannedResult && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4 dark:border-emerald-950/40 dark:bg-zinc-950/50 space-y-4">
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase dark:text-emerald-450">
                  {t("scanner.lastResult")}
                </p>
                <p className="mt-1.5 font-mono text-sm break-all text-gray-800 dark:text-zinc-200">
                  {scannedResult}
                </p>
              </div>

              {scannedUser ? (
                <div className="flex items-center gap-4 rounded-xl border border-emerald-200/50 bg-white/50 p-3 dark:border-emerald-500/10 dark:bg-slate-900/50">
                  {scannedUser.avatarUrl ? (
                    <img
                      src={scannedUser.avatarUrl}
                      alt={scannedUser.username}
                      className="h-12 w-12 rounded-full object-cover border border-emerald-200/30"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg dark:bg-emerald-500 dark:text-zinc-950">
                      {scannedUser.profile?.fullName
                        ? scannedUser.profile.fullName.charAt(0).toUpperCase()
                        : scannedUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {scannedUser.profile?.fullName || scannedUser.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                      @{scannedUser.username} • {scannedUser.email}
                    </p>
                    {scannedUser.coin && (
                      <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        💰 {scannedUser.coin.amount} EcoCoins
                        {scannedUser.profile?.streak !== undefined && scannedUser.profile.streak > 0 && (
                          <span className="ml-2 text-amber-600 dark:text-amber-400">
                            🔥 {scannedUser.profile.streak} {t("scanner.days")}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-xs text-gray-400 dark:text-zinc-500">
                  <span className="h-3 w-3 animate-spin rounded-full border border-gray-450 border-t-transparent mr-2" />
                  {t("scanner.loadingUser")}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            variant="outline"
            type="button"
            className="flex-1 rounded-2xl border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-950/20 px-5 py-2.5 h-auto transition-all duration-300 font-bold"
            onClick={onReset}
          >
            <RotateCcw className="mr-2" size={16} />
            {t("scanner.reset")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

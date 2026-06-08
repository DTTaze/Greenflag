import {
  Calendar,
  Check,
  Coins,
  Copy,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

export default function CustomerStatsCard({
  userData,
  generateQRCode,
  qrCode,
  showQrDialog,
  setShowQrDialog,
  copyToClipboard,
  userInfo,
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    copyToClipboard(userInfo?.public_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAmount = (coinsObj) => {
    if (typeof coinsObj === "object" && coinsObj !== null) {
      return coinsObj.amount ?? 0;
    }
    return coinsObj ?? 0;
  };

  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Name and Username */}
      <h2 className="text-xl font-bold text-slate-800">
        {userData?.full_name || "Customer"}
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        @{userData?.username || "username"}
      </p>

      {/* Coins Count banner */}
      <div className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 shadow-sm">
        <Coins className="h-6 w-6 text-amber-600" />
        <span className="text-lg font-bold text-emerald-800">
          {getAmount(userData?.coins)} Coins
        </span>
      </div>

      {/* Show QR Code button */}
      <Button
        variant="outline"
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-emerald-600 font-bold text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
        onClick={generateQRCode}
      >
        <QrCode className="h-4 w-4" />
        Show QR Code
      </Button>

      {/* Details divider */}
      <div className="my-5 h-px w-full bg-slate-100" />

      {/* Profile Details fields */}
      <div className="w-full space-y-4">
        <div className="flex items-center text-sm text-slate-700">
          <Mail className="mr-3 h-4 w-4 shrink-0 text-emerald-600" />
          <span className="truncate">{userData?.email || "Email not set"}</span>
        </div>

        <div className="flex items-center text-sm text-slate-700">
          <Phone className="mr-3 h-4 w-4 shrink-0 text-emerald-600" />
          <span>{userData?.phone_number || "Phone not set"}</span>
        </div>

        <div className="flex items-center text-sm text-slate-700">
          <Calendar className="mr-3 h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            Joined:{" "}
            {userData?.last_logined
              ? new Date(userData.last_logined).toLocaleDateString()
              : "Unknown"}
          </span>
        </div>

        {userData?.role && (
          <div className="mt-2 flex items-center">
            <ShieldCheck className="mr-3 h-4 w-4 shrink-0 text-emerald-600" />
            <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {userData.role}
            </span>
          </div>
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-emerald-800">
              Your Personal QR Code
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Scan this QR code to quickly access your profile or register for
              events.
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/20 p-6">
            {qrCode ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="h-auto max-w-[200px] rounded-md border border-slate-100 bg-white p-2 shadow-sm"
                />
                <button
                  onClick={handleCopy}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                >
                  <span>Public ID: {userInfo?.public_id}</span>
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => setShowQrDialog(false)}
              className="cursor-pointer rounded-lg bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

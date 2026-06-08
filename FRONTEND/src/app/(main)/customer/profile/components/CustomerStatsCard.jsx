import React from "react";
import { Coins, QrCode, Mail, Phone, Calendar, ShieldCheck, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

export default function CustomerStatsCard({
  userData,
  generateQRCode,
  qrCode,
  showQrDialog,
  setShowQrDialog,
  copyToClipboard,
  userInfo
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center">
      {/* Name and Username */}
      <h2 className="text-xl font-bold text-slate-800">
        {userData?.full_name || "Customer"}
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        @{userData?.username || "username"}
      </p>

      {/* Coins Count banner */}
      <div className="w-full flex items-center justify-center gap-2 py-3 px-4 mb-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 shadow-sm">
        <Coins className="w-6 h-6 text-amber-600" />
        <span className="text-lg font-bold text-emerald-800">
          {getAmount(userData?.coins)} Coins
        </span>
      </div>

      {/* Show QR Code button */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-bold h-10 rounded-lg transition-colors cursor-pointer"
        onClick={generateQRCode}
      >
        <QrCode className="w-4 h-4" />
        Show QR Code
      </Button>

      {/* Details divider */}
      <div className="w-full h-px bg-slate-100 my-5" />

      {/* Profile Details fields */}
      <div className="w-full space-y-4">
        <div className="flex items-center text-slate-700 text-sm">
          <Mail className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
          <span className="truncate">{userData?.email || "Email not set"}</span>
        </div>

        <div className="flex items-center text-slate-700 text-sm">
          <Phone className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
          <span>{userData?.phone_number || "Phone not set"}</span>
        </div>

        <div className="flex items-center text-slate-700 text-sm">
          <Calendar className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
          <span>
            Joined:{" "}
            {userData?.last_logined
              ? new Date(userData.last_logined).toLocaleDateString()
              : "Unknown"}
          </span>
        </div>

        {userData?.role && (
          <div className="flex items-center mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              {userData.role}
            </span>
          </div>
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-emerald-800">
              Your Personal QR Code
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Scan this QR code to quickly access your profile or register for events.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/20 my-2">
            {qrCode ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="max-w-[200px] h-auto rounded-md shadow-sm bg-white p-2 border border-slate-100"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-100 transition-colors cursor-pointer"
                >
                  <span>Public ID: {userInfo?.public_id}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => setShowQrDialog(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

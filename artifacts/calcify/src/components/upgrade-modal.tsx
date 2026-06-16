import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Zap } from "lucide-react";
import { getUserIdValue } from "@/use-pro";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpgradeModal({ open, onClose, onSuccess }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const userId = getUserIdValue();
      const res = await fetch(`${API_BASE}/api/subscriptions/create-order`, {
        method: "POST",
        headers: { "x-user-id": userId },
      });
      const { orderId, amount, currency } = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id: orderId,
        name: "Calcify Pro",
        description: "Pro Monthly Subscription",
        handler: async (response: any) => {
          const verifyRes = await fetch(`${API_BASE}/api/subscriptions/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": userId,
            },
            body: JSON.stringify(response),
          });
          const data = await verifyRes.json();
          if (data.success) {
            onSuccess();
            onClose();
          }
        },
        prefill: { name: "Calcify User" },
        theme: { color: "#7c3aed" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="rounded-xl border border-violet-200 bg-violet-50 dark:bg-violet-950/20 dark:border-violet-800 p-4 text-center">
            <div className="text-3xl font-bold text-violet-700 dark:text-violet-300">
              ₹99
              <span className="text-base font-normal text-muted-foreground">/month</span>
            </div>
            <Badge variant="secondary" className="mt-1">Cancel anytime</Badge>
          </div>

          <ul className="space-y-3">
            {[
              "Calculation history sync across devices",
              "Save and name your calculations",
              "Unlimited favorites",
              "Priority support",
              "Early access to new calculators",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <Button
            className="w-full gap-2 bg-violet-600 hover:bg-violet-700"
            onClick={handleUpgrade}
            disabled={loading}
          >
            <Zap className="h-4 w-4" />
            {loading ? "Processing..." : "Upgrade Now — ₹99/month"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

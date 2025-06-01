import { Button } from "@/components/ui/button";
import { formatNumberLocale } from "@/utils/function";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

type DepositLimitOverlayProps = {
  isVisible: boolean;
  depositLimit: number;
  maxLimit: number;
};

const DepositLimitOverlay = ({
  isVisible,
  depositLimit,
  maxLimit,
}: DepositLimitOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-black border-2 border-red-500 rounded-lg p-8 max-w-md mx-4 relative">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} className="text-white" />
          </div>

          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Deposit Limit Reached
          </h2>

          <p className="text-white mb-6">
            You have reached your daily deposit limit of{" "}
            <span className="font-bold text-red-400">
              ₱{formatNumberLocale(maxLimit)}
            </span>
          </p>

          <div className="bg-orange-950 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Current Deposits:</span>
              <span className="text-red-400 font-bold">
                ₱{formatNumberLocale(depositLimit)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-300">Daily Limit:</span>
              <span className="text-white font-bold">
                ₱{formatNumberLocale(maxLimit)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-6">
            Please try again tomorrow or contact support.
          </p>
          <Link href="/dashboard">
            <Button variant="card">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DepositLimitOverlay;

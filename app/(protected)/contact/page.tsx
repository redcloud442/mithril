"use client";

import { getUserSponsorLink } from "@/services/User/User";
import { useRole } from "@/utils/context/roleContext";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Facebook,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const Page = () => {
  const { profile } = useRole();
  const { data: sponsor, isLoading } = useQuery({
    queryKey: ["sponsor", profile.user_id],
    queryFn: () => getUserSponsorLink(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sponsor?.user_fb_link ?? "");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {}
  };

  const handleOpenLink = () => {
    if (sponsor?.user_fb_link) {
      window.open(sponsor.user_fb_link, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <p className="text-center text-gray-600">
            Loading your sponsor link...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="bg-amber-100 rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Facebook className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Sponsor Facebook Link</h1>
          </div>
          <p className="text-blue-100 text-sm">Your Sponsor Facebook Link</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {sponsor?.user_fb_link ? (
            <>
              {/* Sponsor Info */}
              {sponsor.user_username && (
                <div className="bg-amber-500 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Sponsor</p>
                      <p className="font-semibold text-white">
                        {sponsor.user_username}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-white" />
                      <span className="text-xs text-white font-medium uppercase tracking-wide">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Link Display */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">
                  Facebook Link
                </label>
                <div className="bg-amber-500 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-800 break-all select-all font-mono">
                    {sponsor.user_fb_link}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 font-medium"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>

                <button
                  onClick={handleOpenLink}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open
                </button>
              </div>

              {/* Success Messages */}
              {copySuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800">
                    Link copied to clipboard!
                  </p>
                </div>
              )}
            </>
          ) : (
            // No link available
            <div className="text-center py-8">
              <div className="bg-gray-100 rounded-full p-4 mx-auto w-fit mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Sponsor Link Available
              </h3>
              <p className="text-gray-600 text-sm">
                Your sponsor Facebook link hasn&apos;t been set up yet. Please
                contact support for assistance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

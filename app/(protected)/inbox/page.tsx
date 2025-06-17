"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNotifications } from "@/services/Notification/Notification";
import { useNotificationCountStore } from "@/store/useNotificationCount";
import { useRole } from "@/utils/context/roleContext";
import { createClientSide } from "@/utils/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Bell, ChevronDown, Clock, Eye, Mail } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";

const Page = () => {
  const supabase = createClientSide();
  const { profile } = useRole();
  const { setNotificationToZero, notificationCount } =
    useNotificationCountStore();

  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["notifications", profile?.user_id],
    queryFn: async (params) => {
      const { data: token } = await supabase.auth.getSession();
      return getNotifications(
        token.session?.access_token || "",
        10,
        params.pageParam || 0
      );
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      const alreadyFetched = pages.flatMap((page) => page.notification).length;
      const totalAvailable = lastPage.notification_count;

      return alreadyFetched < totalAvailable ? pages.length : undefined;
    },
    initialPageParam: 0,
  });

  const allNotifications =
    notifications?.pages?.flatMap((page) => page.notification) || [];
  const totalCount = notifications?.pages?.[0]?.notification_count || 0;

  const formatTimeAgo = useMemo(
    () => (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMilliseconds = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60)
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
      if (diffInHours < 24)
        return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
      if (diffInDays < 7)
        return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;

      return date.toLocaleDateString();
    },
    [allNotifications]
  );

  useEffect(() => {
    if (notificationCount > 0) {
      setNotificationToZero();
    }
  }, [notificationCount]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Inbox
                </h1>
                <p className="text-amber-700/70 text-sm">{totalCount} total</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-amber-100 rounded w-3/4"></div>
                      <div className="h-3 bg-amber-50 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {allNotifications.length > 0 ? (
              allNotifications.map((notification) => {
                const isRead = notification.notification_is_read;
                return (
                  <Card
                    key={notification.notification_id}
                    className={`group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4   cursor-pointer ${!isRead ? "ring-2 ring-blue-100" : ""}`}
                  >
                    <CardContent className="p-0 bg-amber-50 rounded-lg">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Enhanced Avatar with Status */}
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-12 h-12 ring-2 ring-white shadow-lg">
                              <AvatarImage
                                src="/assets/card/background-card.webp"
                                alt="System Notification"
                              />
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg"></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <h3
                                  className={`font-semibold text-lg leading-tight ${
                                    !isRead ? "text-gray-900" : "text-gray-600"
                                  }`}
                                >
                                  {notification.notification_title}
                                </h3>
                              </div>
                            </div>

                            <p
                              className={`text-sm mb-4 leading-relaxed ${
                                !isRead ? "text-gray-700" : "text-gray-500"
                              }`}
                            >
                              {notification.notification_message}
                            </p>

                            {/* Bottom Section */}
                            <div className="flex flex-col sm:flex-row items-end gap-2 sm:items-center justify-end sm:justify-between">
                              <div className="flex items-center gap-4">
                                {/* Time with enhanced styling */}
                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                                  <Clock className="w-3 h-3" />
                                  {formatTimeAgo(
                                    notification.notification_created_at
                                  )}
                                </div>
                              </div>

                              {notification.notification_image_url.length >
                                0 && (
                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        View Details
                                      </Button>
                                    </DialogTrigger>

                                    <DialogContent
                                      type="table"
                                      className="dark:bg-black dark:border-amber-500 border-2"
                                    >
                                      <ScrollArea className="h-[500px]">
                                        <DialogHeader className="text-white">
                                          <DialogTitle>
                                            {notification.notification_title}
                                          </DialogTitle>
                                          <DialogDescription>
                                            {notification.notification_message}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
                                          {notification.notification_image_url.map(
                                            (url) => (
                                              <Image
                                                key={url}
                                                src={url}
                                                width={400}
                                                height={400}
                                                alt={
                                                  notification.notification_title
                                                }
                                              />
                                            )
                                          )}
                                        </div>
                                      </ScrollArea>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg"></div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              /* Empty State */
              <Card className="border-2 border-dashed border-amber-200 bg-white/50">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No notifications
                  </h3>
                  <p className="text-amber-600/80 text-sm">
                    You&apos;re all caught up! New notifications will appear
                    here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Load more notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

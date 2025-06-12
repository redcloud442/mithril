"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/ui/dropZone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BroadcastNotification,
  SendNotification,
} from "@/services/Notification/Notification";
import { getUserByUsername } from "@/services/User/Admin";
import { useDebounce } from "@/utils/hook/hook";
import { createClientSide } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { user_table } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  mode: z.enum(["sendToAll", "sendToUser"]),
  userIds: z.string().array().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().optional(),
  file: z.instanceof(File),
});

type NotificationFormData = z.infer<typeof formSchema>;

const AdminNotificationPage = () => {
  const supabaseClient = createClientSide();
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: "sendToAll",
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<user_table[]>([]);
  const mode = useWatch({ control: form.control, name: "mode" });
  const selectedUserIds =
    useWatch({ control: form.control, name: "userIds" }) || [];

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const { data: users = [], isLoading: isUsersLoading } = useQuery<
    user_table[]
  >({
    queryKey: ["users", debouncedSearch],
    queryFn: async () => {
      const res = await getUserByUsername({ username: debouncedSearch });
      return res.data;
    },
    enabled: mode === "sendToUser",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      const { data: token } = await supabaseClient.auth.getSession();

      if (data.mode === "sendToAll") {
        const res = await BroadcastNotification(
          {
            mode: data.mode,
            userIds: data.userIds || [],
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl || "",
          },
          token.session?.access_token || ""
        );
        return res;
      } else {
        const res = await SendNotification(
          {
            mode: data.mode,
            userIds: data.userIds || [],
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl || "",
          },
          token.session?.access_token || ""
        );
        return res;
      }
    },
    onSettled: () => {
      form.reset();
      setSearch("");
      setSelectedUsers([]);
    },
  });

  const onSubmit = async (values: NotificationFormData) => {
    const { file } = values;
    let filePaths;
    try {
      if (file) {
        const filePath = `uploads/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabaseClient.storage
          .from("REQUEST_ATTACHMENTS")
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          throw new Error("File upload failed.");
        }

        filePaths = `${process.env.NODE_ENV === "development" ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}` : "https://cdn.omnix-global.com"}/storage/v1/object/public/REQUEST_ATTACHMENTS/${filePath}`;
      }

      const formattedValues = {
        ...values,
        imageUrl: filePaths,
      };

      mutate(formattedValues);
      toast({
        title: "Notification submitted!",
        description: "Your notification has been submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to submit notification",
        description: "Please try again",
      });
    }
  };

  const removeUser = (userIdToRemove: string) => {
    const currentUserIds = form.getValues("userIds") || [];
    const newUserIds = currentUserIds.filter((id) => id !== userIdToRemove);
    setSelectedUsers(
      selectedUsers.filter((user) => user.user_id !== userIdToRemove)
    );
    form.setValue("userIds", newUserIds);
  };

  const handleAddUser = (user: user_table) => {
    setSelectedUsers([...selectedUsers, user]);
    form.setValue("userIds", [...selectedUserIds, user.user_id]);
  };

  const handleSelectOnChange = (value: string) => {
    if (value === "sendToAll") {
      form.setValue("userIds", []);
      setSelectedUsers([]);
    }
    form.setValue("mode", value as "sendToAll" | "sendToUser");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Mode Selector */}
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send To</FormLabel>
                    <Select
                      onValueChange={handleSelectOnChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sendToAll">All Users</SelectItem>
                        <SelectItem value="sendToUser">
                          Specific Users
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User Multiselect */}
              {mode === "sendToUser" && (
                <FormField
                  control={form.control}
                  name="userIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Users</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {/* Selected Users Display */}
                          {selectedUsers.length > 0 && (
                            <div className="border rounded-md p-2">
                              <p className="text-sm font-medium mb-2">
                                Selected Users ({selectedUsers.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedUsers.map((user) => (
                                  <div
                                    key={user.user_id}
                                    className=" bg-gray-100 text-black px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                  >
                                    <span>{user.user_username}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeUser(user.user_id)}
                                      className="ml-1 text-red-600 hover:text-red-800 font-bold cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Search and Select Users */}
                          <div className="border p-3 rounded space-y-2">
                            <Input
                              placeholder="Search users to add..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="mb-2"
                            />
                            {isUsersLoading ? (
                              <p className="text-sm text-muted-foreground">
                                Loading...
                              </p>
                            ) : users.length > 0 ? (
                              <div className="max-h-40 overflow-y-auto space-y-1">
                                {users.map((user) => (
                                  <label
                                    key={user.user_id}
                                    className="flex items-center gap-2 border-2 p-2 rounded cursor-pointer"
                                  >
                                    <div className="flex justify-between items-center gap-2 w-full">
                                      <span className="text-sm">
                                        {user.user_username}
                                      </span>

                                      <Button
                                        type="button"
                                        onClick={() => handleAddUser(user)}
                                        variant="outline"
                                        className="cursor-pointer"
                                        size="sm"
                                      >
                                        Select
                                      </Button>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            ) : search.trim() ? (
                              <p className="text-sm text-muted-foreground">
                                No users found for &quot;{search}&quot;
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Start typing to search for users
                              </p>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <FileUpload
                        type="single"
                        {...field}
                        onFileChange={(file) => {
                          field.onChange(file as File);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Submitting..." : "Submit Notification"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationPage;

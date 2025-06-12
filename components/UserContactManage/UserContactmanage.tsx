"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  Copy,
  ExternalLink,
  Facebook,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import {
  CreateContact,
  DeleteContact,
  GetAllContacts,
} from "@/services/Contact/Contact";
import { useRole } from "@/utils/context/roleContext";
import { formatDateToYYYYMMDD } from "@/utils/function";
import { CreateContactFormValues, CreateContactSchema } from "@/utils/schema";
import { createClientSide } from "@/utils/supabase/client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Contact = {
  contact_id: string;
  contact_name: string;
  contact_fb_link: string;
  contact_category: string;
  contact_user_id: string;
  contact_created_at: string;
};

const FacebookContactManager = () => {
  const supabaseClient = createClientSide();
  const queryClient = useQueryClient();

  const { profile } = useRole();
  const { toast } = useToast();

  const [copiedId, setCopiedId] = useState<number | null>(null);

  const queryKey = ["contacts", profile?.user_id];

  const {
    data: contacts,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async (params) => {
      const { data: token } = await supabaseClient.auth.getSession();
      return GetAllContacts(
        token.session?.access_token || "",
        10,
        params.pageParam || 0
      );
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      const alreadyFetched = pages.flatMap((page) => page?.contact).length;
      const totalAvailable = lastPage?.total;

      return alreadyFetched < totalAvailable ? pages.length : undefined;
    },
    initialPageParam: 0,
  });
  const form = useForm({
    resolver: zodResolver(CreateContactSchema),
    defaultValues: {
      name: "",
      fbLink: "",
      category: "Friend",
    },
  });

  const deleteContact = (id: string) => {
    deleteContactMutation(id);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(Number(id));
      toast({
        title: "Copied to clipboard",
        description: "Contact link has been copied to your clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
      });
    }
  };

  const handleFetchNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const { mutate: createContact, isPending } = useMutation({
    mutationFn: async (data: CreateContactFormValues) => {
      const { data: token } = await supabaseClient.auth.getSession();
      return CreateContact(data, token.session?.access_token || "");
    },
    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey });
      const previousContacts = queryClient.getQueryData(queryKey);

      const newContact = {
        contact_id: Date.now(),
        contact_name: data.name,
        contact_fb_link: data.fbLink,
        contact_category: data.category,
        contact_user_id: profile?.user_id,
        contact_created_at: new Date().toISOString().split("T")[0],
      };

      queryClient.setQueryData(
        queryKey,
        (
          old:
            | {
                pages: { contact: Contact[]; total: number }[];
                pageParams: unknown[];
              }
            | undefined
        ) => {
          if (!old) {
            return {
              pages: [{ contact: [newContact], total: 1 }],
              pageParams: [0],
            };
          }

          return {
            ...old,
            pages: old.pages.map((page, index) => {
              const existingContacts = Array.isArray(page.contact)
                ? page.contact
                : [];
              return index === 0
                ? {
                    ...page,
                    contact: [newContact, ...existingContacts],
                    total: (page.total || 0) + 1,
                  }
                : page;
            }),
          };
        }
      );

      return { previousContacts };
    },

    onSuccess: () => {
      toast({
        title: "Contact created successfully",
        description: "Your contact has been added to your list",
      });
      form.reset();
    },
    onError: (error, data, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(queryKey, context.previousContacts);
      }
      console.log(error);
      toast({
        title: "Failed to create contact",
        description: "Please try again",
      });
    },
    onSettled: () => {
      // queryClient.invalidateQueries({
      //   queryKey,
      // });
    },
  });

  const { mutate: deleteContactMutation, isPending: isDeleting } = useMutation({
    mutationFn: async (contactId: string) => {
      const { data: token } = await supabaseClient.auth.getSession();
      return DeleteContact(contactId, token.session?.access_token || "");
    },
    onMutate: async (contactId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousContacts = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (
          old:
            | {
                pages: { contact: Contact[]; total: number }[];
                pageParams: unknown[];
              }
            | undefined
        ) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              contact: page.contact.filter(
                (contact) => contact.contact_id !== contactId
              ),
              total: Math.max((page.total || 1) - 1, 0),
            })),
          };
        }
      );

      return { previousContacts };
    },
    onError: (_error, _contactId, context) => {
      console.log(_error);
      if (context?.previousContacts) {
        queryClient.setQueryData(queryKey, context.previousContacts);
      }
      toast({
        title: "Failed to delete contact",
        description: "Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Contact deleted",
        description: "The contact was successfully removed.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const onSubmit = (data: CreateContactFormValues) => {
    createContact(data);
  };

  const useMemoizedContacts = useMemo(() => {
    return contacts?.pages?.flatMap((page) => page?.contact) || [];
  }, [contacts]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-700 rounded-full mb-4 shadow-lg">
            <Facebook className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-700 mb-2">
            Facebook Contact Manager
          </h1>
          <p className="text-amber-700 text-lg">
            Organize and manage your Facebook connections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Plus className="w-5 h-5" /> Add New Contact
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Add a new Facebook contact to your list
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter contact name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fbLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://facebook.com/username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Friend">Friend</SelectItem>
                                <SelectItem value="Family">Family</SelectItem>
                                <SelectItem value="Business">
                                  Business
                                </SelectItem>
                                <SelectItem value="Colleague">
                                  Colleague
                                </SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 shadow-lg h-10"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Contact
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-amber-700" />
                      My Facebook Contacts
                      <Badge variant="secondary">
                        {contacts?.pages[0].total}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Manage your Facebook contact collection
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {useMemoizedContacts.length > 0 ? (
                    useMemoizedContacts.map((contact) => (
                      <Card
                        key={contact.contact_id}
                        className="group border shadow-sm hover:shadow-lg hover:border-blue-300 transition-all"
                      >
                        <CardContent className="flex items-center justify-between gap-4 py-4 px-6">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-r from-amber-700 to-orange-600 rounded-full flex items-center justify-center shadow">
                              <Facebook className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold  truncate">
                                {contact.contact_name}
                              </h3>
                              <p className="text-sm text-blue-600 truncate hover:text-blue-800">
                                {contact.contact_fb_link}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="default" className="text-xs">
                                  {contact.contact_category}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Added{" "}
                                  {formatDateToYYYYMMDD(
                                    contact.contact_created_at
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(contact.contact_fb_link, "_blank")
                              }
                              className="hover:bg-blue-50"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  contact.contact_fb_link,
                                  contact.contact_id
                                )
                              }
                              className="hover:bg-green-50"
                            >
                              {copiedId === Number(contact.contact_id) ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-red-50 hover:border-red-300"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Contact</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                  Are you sure you want to delete this contact?
                                </DialogDescription>
                                <DialogFooter>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      deleteContact(contact.contact_id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteContact(contact.contact_id)}
                              className="hover:bg-red-50 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button> */}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-white">No contacts found</p>
                    </div>
                  )}

                  {hasNextPage && (
                    <Button
                      onClick={handleFetchNextPage}
                      className="w-full bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 shadow-lg h-10"
                    >
                      Load More
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookContactManager;

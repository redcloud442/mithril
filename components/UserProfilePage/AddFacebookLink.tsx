"use client";
import { useToast } from "@/hooks/use-toast";
import { logError } from "@/services/Error/ErrorLogs";
import { createClientSide } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

import { updateUserFacebookLink } from "@/services/User/User";
import { useRole } from "@/utils/context/roleContext";
import {
  AddFacebookLinkFormValues,
  AddFacebookLinkSchema,
} from "@/utils/schema";
import ReusableCard from "../ui/card-reusable";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const AddFacebookLink = () => {
  const { toast } = useToast();
  const { profile, setProfile } = useRole();

  const form = useForm<AddFacebookLinkFormValues>({
    resolver: zodResolver(AddFacebookLinkSchema),
    defaultValues: {
      facebookLink: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const supabaseClient = createClientSide();

  const onSubmit = async (data: AddFacebookLinkFormValues) => {
    try {
      await updateUserFacebookLink({
        userId: profile.user_id,
        facebookLink: data.facebookLink,
      });

      setProfile((prev) => ({
        ...prev,
        user_fb_link: data.facebookLink ?? "",
      }));

      reset();

      toast({
        title: "Password Change Successfully",
      });
    } catch (e) {
      if (e instanceof Error) {
        await logError(supabaseClient, {
          errorMessage: e.message,
          stackTrace: e.stack,
          stackPath: "components/UserAdminProfile/ChangePassword.tsx",
        });
      }
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <ReusableCard title="Add Facebook Link">
      <div className="p-4 space-y-2">
        {profile.user_fb_link && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white select-all">
              FB LINK:
            </span>
            <span className="text-sm font-medium text-white select-all underline">
              {profile.user_fb_link}
            </span>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(profile.user_fb_link ?? "")
              }
              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 pt-4 gap-4"
        >
          <FormField
            control={control}
            name="facebookLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Facebook Link
                </FormLabel>
                <FormControl>
                  <Input
                    id="facebookLink"
                    variant="non-card"
                    className="mt-1 border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-center">
            <Button
              disabled={isSubmitting}
              type="submit"
              variant="card"
              className=" font-black text-2xl rounded-full p-5"
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </ReusableCard>
  );
};

export default AddFacebookLink;

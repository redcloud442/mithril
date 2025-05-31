"use client";

import { useToast } from "@/hooks/use-toast";
import { logError } from "@/services/Error/ErrorLogs";
import {
  getMerchantData,
  handleCreateMerchantData,
} from "@/services/merchant/Merchant";
import { useRole } from "@/utils/context/roleContext";
import { escapeFormData } from "@/utils/function";
import { createClientSide } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { merchant_table } from "@prisma/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ReusableTable from "../ReusableTable/ReusableTable";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FileUpload from "../ui/dropZone";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMerchantColumn } from "./MerchantColumn";

const filterFormValuesSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  accountType: z.string().min(1, "Account type is required"),
  bankName: z.string().min(1, "Bank name is required"),
  file: z
    .instanceof(File)
    .refine((file) => !!file, { message: "File is required" })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type) &&
        file.size <= 12 * 1024 * 1024, // 12MB limit
      { message: "File must be a valid image and less than 12MB." }
    )
    .optional(),
});

type FilterFormValues = z.infer<typeof filterFormValuesSchema>;

const MerchantTable = () => {
  const supabaseClient = createClientSide();
  const { toast } = useToast();
  const { teamMemberProfile } = useRole();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [requestData, setRequestData] = useState<merchant_table[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const fetchMerchant = async () => {
    try {
      setIsFetchingList(true);
      const { data, totalCount } = await getMerchantData({
        page: activePage,
        limit: 10,
      });

      setRequestData(data);
      setRequestCount(totalCount);
    } catch (e) {
    } finally {
      setIsFetchingList(false);
    }
  };

  const {
    columns,
    isLoading,
    handleUpdateMerchant,
    isDeleteModal,
    setIsDeleteModal,
  } = useMerchantColumn(setRequestData);

  const table = useReactTable({
    data: requestData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const pageCount = Math.ceil(requestCount / 10);

  const { handleSubmit, reset, control, formState, watch } =
    useForm<FilterFormValues>({
      resolver: zodResolver(filterFormValuesSchema),
      defaultValues: {
        accountNumber: "",
        accountType: "",
        bankName: "",
      },
    });

  useEffect(() => {
    fetchMerchant();
  }, [supabaseClient, teamMemberProfile, activePage, sorting]);

  const handleCreateMerchant = async (data: FilterFormValues) => {
    try {
      const sanitizedData = escapeFormData(data);
      const file = data.file;
      const attachmentUrl = null;

      if (file) {
        const filePath = `uploads/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabaseClient.storage
          .from("REQUEST_ATTACHMENTS")
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          toast({
            title: "Error",
            description: "An error occurred while uploading the file.",
            variant: "destructive",
          });
          return;
        }
      }

      const { data: merchantData } = await handleCreateMerchantData({
        accountNumber: sanitizedData.accountNumber,
        accountType: sanitizedData.accountType,
        accountName: sanitizedData.bankName,
        merchantQrAttachment: attachmentUrl ? attachmentUrl : "",
      });

      toast({
        title: "Merchant Created",
        description: "Merchant has been created successfully",
      });

      setRequestData((prev) => [...prev, merchantData]);
      setIsOpenModal(false);
    } catch (e) {
      if (e instanceof Error) {
        await logError(supabaseClient, {
          errorMessage: e.message,
          stackTrace: e.stack,
          stackPath: "components/MerchantPage/MerchantTable.tsx",
        });
      }
      toast({
        title: "Error",
        description: "An error occurred while creating the merchant.",
        variant: "destructive",
      });
    }
  };

  const uploadedFile = watch("file");

  return (
    <Card className="w-full rounded-sm p-4">
      <div className="flex flex-wrap gap-4 items-start py-4">
        {" "}
        <div className="flex flex-wrap  gap-2 items-center w-full">
          {isDeleteModal.isOpen && (
            <Dialog
              open={isDeleteModal.isOpen}
              onOpenChange={(open) =>
                setIsDeleteModal({ ...isDeleteModal, isOpen: open })
              }
            >
              <DialogContent>
                <DialogDescription />
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete this merchant?
                  </DialogTitle>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button
                    disabled={isLoading}
                    onClick={() =>
                      handleUpdateMerchant({
                        merchantId: isDeleteModal.merchantId,
                      })
                    }
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" /> Deleting ...
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Dialog
            open={isOpenModal}
            onOpenChange={(open) => {
              setIsOpenModal(open);
              if (!isOpenModal) {
                reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto rounded-md" variant="outline">
                Create New Merchant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogDescription />
              <DialogHeader>
                <DialogTitle>Create Merchant</DialogTitle>
              </DialogHeader>
              <form
                className="flex flex-col gap-6 w-full max-w-4xl rounded-md"
                onSubmit={handleSubmit(handleCreateMerchant)}
              >
                <Controller
                  name="accountNumber"
                  control={control}
                  rules={{ required: "Account number is required" }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <Label>Account Number</Label>
                      <Input
                        placeholder="Enter the account number..."
                        {...field}
                      />
                      {fieldState.error && (
                        <span className="text-red-500 text-sm">
                          {fieldState.error.message}
                        </span>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="accountType"
                  control={control}
                  rules={{ required: "Account type is required" }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="bank">Bank Type</Label>
                      <Input
                        placeholder="Enter the account type..."
                        {...field}
                      />
                      {fieldState.error && (
                        <span className="text-red-500 text-sm">
                          {fieldState.error.message}
                        </span>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="bankName"
                  control={control}
                  rules={{ required: "Account name is required" }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <Label>Account Name</Label>
                      <Input
                        placeholder="Enter the account name..."
                        {...field}
                      />
                      {fieldState.error && (
                        <span className="text-red-500 text-sm">
                          {fieldState.error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
                <div>
                  <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                      <FileUpload
                        label="Upload QR"
                        onFileChange={(file) => field.onChange(file)}
                      />
                    )}
                  />
                  {uploadedFile && !formState.errors.file && (
                    <p className="text-md font-bold text-green-700">
                      {"File Uploaded Successfully"}
                    </p>
                  )}

                  {formState.errors.file && (
                    <p className="text-primaryRed text-sm mt-1">
                      {formState.errors.file?.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    disabled={formState.isSubmitting}
                    type="submit"
                    className="w-full rounded-md"
                    variant="card"
                  >
                    {formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" /> Creating ...
                      </div>
                    ) : (
                      "Create"
                    )}
                  </Button>
                  <DialogClose asChild>
                    <Button className="w-full rounded-md dark:border-black border-2">
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            onClick={fetchMerchant}
            disabled={isFetchingList}
            size="sm"
            className="w-full sm:w-auto"
          >
            <RefreshCw className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <ReusableTable
        table={table}
        columns={columns}
        activePage={activePage}
        totalCount={requestCount}
        isFetchingList={isFetchingList}
        setActivePage={setActivePage}
        pageCount={pageCount}
      />
    </Card>
  );
};

export default MerchantTable;

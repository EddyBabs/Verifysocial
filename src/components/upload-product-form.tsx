"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Image from "next/image";
import { uploadProductImage } from "@/actions/product";
import { useToast } from "@/hooks/use-toast";

const UploadProductForm = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  const simulateProgress = () => {
    setProgress((prev) => (prev < 100 ? prev + 10 : 100));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(10); //
    const formData = new FormData();
    formData.append("file", file);

    const progressInterval = setInterval(simulateProgress, 300);

    try {
      await uploadProductImage(formData).then((response) => {
        clearInterval(progressInterval);
        if (response.success) {
          setProgress(100);
          toast({
            description: "Uploaded product successfully",
          });
          setIsOpen(false);
        } else {
          toast({ description: response.error, variant: "destructive" });
        }
      });
    } catch (error) {
      setProgress(0);
      clearInterval(progressInterval);
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0); // Reset progress when a new file is selected
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => setIsOpen((prev) => (!uploading ? !prev : prev))}
    >
      <DialogTrigger asChild>
        <Button>Add Products</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add products to your inventory for users to see.
          </DialogDescription>
        </DialogHeader>
        <div className="grid-cols-2">
          <div>
            <label htmlFor="product-file">
              {file ? (
                <div>
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Product Image"
                    width={250}
                    height={250}
                    className="aspect-video w-full h-full object-cover mx-auto"
                  />
                </div>
              ) : (
                <div
                  className="cursor-pointer p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600"
                  data-hs-file-upload-trigger=""
                >
                  <div className="text-center">
                    <span className="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-neutral-200">
                      <Upload />
                    </span>

                    <div className="mt-4 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
                      <span className="pe-1 font-medium text-gray-800 dark:text-neutral-200">
                        Drop your file here or
                      </span>
                      <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 dark:bg-neutral-800 dark:text-blue-500 dark:hover:text-blue-600">
                        browse
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-400 dark:text-neutral-400">
                      Pick a file up to 2MB.
                    </p>
                  </div>
                </div>
              )}

              <input
                id="product-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {uploading && (
              <div className="mt-2">
                <Progress value={progress} />
              </div>
            )}
          </div>
          <div></div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleUpload} disabled={uploading}>
            Save changes {uploading && <Loader className="animate-spin ml-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadProductForm;

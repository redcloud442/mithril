import { AlertCircle, Check, File, Image, Upload, X } from "lucide-react";
import React, { useCallback, useState } from "react";

type FileUploaderProps = {
  label?: string;
  onFileChange?: (files: File[]) => void;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  label = "Upload Receipts",
  onFileChange = () => {},
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState("");

  const validateFiles = (newFiles: File[]) => {
    if (newFiles.length < 1) {
      setError("Please select at least 1 file");
      return false;
    }
    if (newFiles.length > 3) {
      setError("Maximum 3 files allowed");
      return false;
    }

    // Check file types - matching your original (images only)
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const invalidFiles = newFiles.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError("Only images (PNG, JPG, JPEG) are allowed");
      return false;
    }

    // Check file sizes (max 10MB each)
    const oversizedFiles = newFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setError("Each file must be smaller than 10MB");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const fileArray = Array.from(selectedFiles);
    if (validateFiles(fileArray)) {
      setFiles(fileArray);
      onFileChange(fileArray);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles as unknown as FileList);
  }, []);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFileChange(newFiles);
    setError("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="w-5 h-5 text-orange-500" />;
    }
    return <File className="w-5 h-5 text-orange-400" />;
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-orange-800">{label}</label>
        <p className="text-xs text-orange-600">
          Supported formats: PNG, JPG, JPEG (max 10MB each)
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ease-in-out
          ${
            isDragActive
              ? "border-orange-400 bg-orange-100 scale-105"
              : "border-orange-500 bg-orange-950 hover:border-orange-400 hover:bg-orange-900"
          }
          ${files.length > 0 ? "border-orange-400 bg-orange-900" : ""}
        `}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="space-y-4">
          {files.length === 0 ? (
            <>
              <Upload
                className={`w-12 h-12 mx-auto ${isDragActive ? "text-orange-400" : "text-orange-300"}`}
              />
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-orange-100">
                  {isDragActive
                    ? "Drop receipts here"
                    : "CLICK HERE TO UPLOAD 1–3 RECEIPTS"}
                </h3>
              </div>
            </>
          ) : (
            <>
              <Check className="w-12 h-12 mx-auto text-orange-400" />
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-orange-100">
                  {files.length} receipt{files.length > 1 ? "s" : ""} selected
                </h3>
                <p className="text-orange-200 mt-1">
                  Click to add more or replace files
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-orange-100 border border-orange-300 rounded-lg">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <span className="text-orange-800 text-sm font-medium">{error}</span>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-orange-800">
            Selected Files:
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg shadow-sm hover:shadow-md hover:bg-orange-100 transition-all"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-orange-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-orange-600">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1 hover:bg-orange-200 rounded-full transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4 text-orange-600 hover:text-orange-800" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Count Indicator */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{files.length}/3 files selected</span>
      </div>
    </div>
  );
};

export default FileUploader;

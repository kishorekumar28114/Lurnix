import React, { useCallback } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    isLoading?: boolean;
}

export function FileUpload({ onFileSelect, selectedFile, isLoading = false }: FileUploadProps) {
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                if (file.type === "application/pdf") {
                    onFileSelect(file);
                } else {
                    alert("Please upload a PDF file.");
                }
            }
        },
        [onFileSelect]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === "application/pdf") {
                onFileSelect(file);
            } else {
                alert("Please upload a PDF file.");
            }
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF (optional)
            </label>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors cursor-pointer ${isLoading
                    ? "border-amber-200 bg-amber-50/50 cursor-wait"
                    : selectedFile
                        ? "border-amber-300 bg-amber-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                onClick={() => !isLoading && document.getElementById("file-upload")?.click()}
            >
                <div className="text-center">
                    {isLoading ? (
                        <Loader2 className="mx-auto h-10 w-10 text-amber-500 animate-spin" />
                    ) : selectedFile ? (
                        <FileText className="mx-auto h-10 w-10 text-amber-500" />
                    ) : (
                        <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                    )}
                    <p className="mt-3 text-sm text-gray-600">
                        {isLoading
                            ? "Extracting text from PDF..."
                            : selectedFile
                                ? selectedFile.name
                                : "Click or drag & drop a PDF here"}
                    </p>
                    {!selectedFile && !isLoading && (
                        <p className="text-xs text-gray-400 mt-1">PDF files only, up to 10MB</p>
                    )}
                </div>
                <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
}

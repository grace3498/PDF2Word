import { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors ${
        isDragging ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-100'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,image/*"
      />
      <label htmlFor="file-upload" className="cursor-pointer w-full flex flex-col items-center text-center">
        <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-sky-600' : 'text-slate-500'}`} />
        <p className={`font-semibold transition-colors ${isDragging ? 'text-sky-600' : 'text-slate-700'}`}>
          Drag & drop your file here
        </p>
        <p className="text-sm text-slate-500">or click to browse</p>
        <p className="text-xs text-slate-400 mt-2">PDF or Image files supported</p>
      </label>
    </div>
  );
}

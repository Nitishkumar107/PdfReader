import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

const FileUpload = ({ onFileUpload, onDemo, isLoading }) => {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileUpload(file);
    e.target.value = null; // Allow re-uploading the same file
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      className="glass-panel p-8 text-center border-2 border-dashed border-gray-500 hover:border-blue-400 transition-colors cursor-pointer"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.txt"
        onChange={handleChange}
        disabled={isLoading}
        onClick={(e) => e.stopPropagation()} // Prevent infinite loop if input was clicked directly
      />
      <div className="flex flex-col items-center gap-4 pointer-events-none">
        <div className="p-4 bg-white/10 rounded-full">
          <Upload size={32} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Upload PDF or Text File</h3>
          <p className="text-gray-400">Drag & drop or click to browse</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 w-full">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDemo();
          }}
          className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors relative z-10"
        >
          Try with Demo Text
        </button>
      </div>

      {isLoading && <p className="mt-4 text-blue-300 animate-pulse">Processing file...</p>}
    </div>
  );
};

export default FileUpload;

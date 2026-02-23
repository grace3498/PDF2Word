import { useState } from 'react';
import FileUpload from './components/FileUpload';
import { extractContent } from './services/geminiService';
import { createAndDownloadDocx } from './utils/docxGenerator';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsDone(false);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);
    setIsDone(false);

    try {
      const textContent = await extractContent(file);
      await createAndDownloadDocx(textContent, file.name);
      setIsDone(true);
    } catch (err) {
      console.error(err);
      setError('Failed to convert the file. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setIsDone(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center font-sans text-slate-800">
      <div className="w-full max-w-xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">File to Word Converter</h1>
          <p className="text-slate-500">Upload a PDF or image, and we'll convert it to a DOCX file.</p>
        </div>

        {!file && <FileUpload onFileSelect={handleFileSelect} />}

        {file && (
          <div className="text-center bg-white p-8 rounded-xl shadow-sm">
            <p className="mb-4">Selected file: <span className="font-semibold">{file.name}</span></p>
            
            {isDone && (
              <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg">
                <p>Success! Your file has been downloaded.</p>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button 
                className="bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                disabled={isConverting}
                onClick={handleConvert}
              >
                {isConverting ? 'Converting...' : 'Convert & Download'}
              </button>
              <button 
                className="bg-slate-200 text-slate-800 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

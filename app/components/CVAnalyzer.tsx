'use client';

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function CVAnalyzer() {
  const [mounted, setMounted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setAnalyzing(true);
      // TODO: Implement actual CV analysis logic here
      const formData = new FormData();
      formData.append('cv', file);

      // Simulate analysis for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('Sample analysis result. Replace this with actual analysis.');
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error('Error analyzing CV. Please try again.');
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          CV Analyzer
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Upload your CV in PDF format for instant analysis
        </p>
      </div>

      <div className="mt-10">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-500">
              Selected file: {file.name}
            </p>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !file}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {analyzing ? 'Analyzing...' : 'Analyze CV'}
        </button>
      </div>

      {result && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Analysis Results</h2>
          <div className="mt-4 text-sm text-gray-500 whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

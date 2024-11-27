'use client';

import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import LoadingAnimation from "./LoadingAnimation";
import ATSPercentage from "./ATSPercentage";
import Accordion from "./Accordion";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AnalysisResponse {
  ATS_Score: number;
  Strengths: string[];
  Weaknesses: string[];
  Suggestions: string[];
  ATS_Friendly: boolean;
}

interface AnalysisResult {
  percentage: number;
  sections: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    conclusion: string;
  };
}

export default function CVAnalyzer() {
  const [mounted, setMounted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    handleFileSelection(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  }, []);

  const handleFileSelection = (selectedFile: File | undefined) => {
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setAnalyzing(true);
      
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze CV');
      }

      const data = await response.json();
      console.log('API Response:', data);

      const analysisData = data.analysis as AnalysisResponse;
      
      setResult({
        percentage: analysisData.ATS_Score || 0,
        sections: {
          strengths: analysisData.Strengths || [],
          improvements: analysisData.Weaknesses || [],
          recommendations: analysisData.Suggestions || [],
          conclusion: analysisData.ATS_Friendly 
            ? "Your CV is ATS-friendly! Keep up the good work and continue to tailor it for specific job applications."
            : "Your CV needs some improvements to be more ATS-friendly. Follow the suggestions above to increase your chances of passing ATS systems."
        }
      });
      
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
    <div className="max-w-3xl mx-auto p-6 pt-24">
      <Toaster position="top-right" />
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading text-text mb-2 tracking-tight">
          CV Analyzer
        </h1>
        <p className="text-lg text-text font-base">
          Upload your CV in PDF format for instant analysis
        </p>
      </div>

      <Card className="border-2 border-border shadow-light">
        <CardContent className="p-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center p-8 border-2 border-border border-dashed rounded-base bg-bg  transition-colors duration-200 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              <Upload className="h-12 w-12 text-text mb-4" />
              <div className="space-y-2">
                <p className="text-xl font-heading text-text">
                  {file ? file.name : "Drop your CV here"}
                </p>
                <p className="text-base text-text font-base">
                  {file ? (
                    "File selected"
                  ) : (
                    <>
                      Drag and drop your CV, or{" "}
                      <label className="text-text hover:text-mainAccent cursor-pointer font-heading underline">
                        browse
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </p>
                <p className="text-sm text-text/80 font-base">PDF files only, up to 10MB</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={analyzing || !file}
            className={`mt-6 w-full h-12 text-base font-heading border-2 border-border rounded-base font-bold
              ${analyzing || !file
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-main hover:bg-main text-text shadow-light hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none'
              } transition-all`}
          >
            {analyzing ? 'Analyzing...' : 'Analyze CV'}
          </Button>
        </CardContent>
      </Card>

      {analyzing && (
        <div className="mt-8">
          <LoadingAnimation />
        </div>
      )}

      {result && result.sections && (
        <div className="mt-8 space-y-6">
          <ATSPercentage percentage={result.percentage} />
          
          <div className="space-y-4">
            <Accordion title="Strengths" defaultOpen>
              <ul className="list-disc pl-5 space-y-2 text-text font-base">
                {result.sections.strengths?.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </Accordion>

            <Accordion title="Areas for Improvement">
              <ul className="list-disc pl-5 space-y-2 text-text font-base">
                {result.sections.improvements?.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </Accordion>

            <Accordion title="Recommendations">
              <ul className="list-disc pl-5 space-y-2 text-text font-base">
                {result.sections.recommendations?.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </Accordion>

            <Accordion title="Conclusion">
              <p className="text-text font-base">{result.sections.conclusion}</p>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}

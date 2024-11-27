'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const handleDownloadCV = async () => {
    try {
      const response = await fetch('/templates/cv-template.pdf');
      if (!response.ok) throw new Error('Failed to download template');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ATS-Friendly-CV-Template.pdf';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Template downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download template. Please try again.');
    }
  };

  return (
    <nav className="top-0 left-0 right-0 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 mt-4">
          {/* Brand */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-heading text-text">
              BaloerDev
            </span>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownloadCV}
            className="border-2 border-border bg-main hover:bg-main text-text shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
          >
            <Download className="w-5 h-5 mr-2" />
            CV Template
          </Button>
        </div>
      </div>
    </nav>
  );
}

'use client';

import { Download, MessageSquarePlus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';

export default function Navbar() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleDownloadCV = async () => {
    try {
      const response = await fetch('/templates/cv-template.pdf');
      if (!response.ok) throw new Error('Failed to download template');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv-template.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('CV Template downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download CV template');
    }
  };

  const handleSubmitFeedbackDialog = async () => {
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback: feedbackText }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      toast.success("Thank you for your feedback!");
      setFeedbackText("");
      setShowFeedback(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-bg z-50 border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold">BaloerDev</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4">
            <Button
              onClick={handleDownloadCV}
              className="border-2 border-border font-bold bg-main hover:bg-main text-text shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              CV Template
            </Button>

            <Button
              onClick={() => setShowFeedback(true)}
              className="border-2 border-border font-bold bg-main hover:bg-main text-text shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
            >
              <MessageSquarePlus className="w-5 h-5 mr-2" />
              Feedback
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(true)}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dialog */}
      <Dialog open={showMenu} onOpenChange={setShowMenu}>
        <DialogContent className="sm:hidden">
          <DialogHeader>
            <DialogTitle className="text-center">Menu</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <Button
              onClick={() => {
                handleDownloadCV();
                setShowMenu(false);
              }}
              className="w-full border-2 border-border font-bold bg-main hover:bg-main text-text shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              CV Template
            </Button>

            <Button
              onClick={() => {
                setShowMenu(false);
                setShowFeedback(true);
              }}
              className="w-full border-2 border-border font-bold bg-main hover:bg-main text-text shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
            >
              <MessageSquarePlus className="w-5 h-5 mr-2" />
              Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center sm:text-left">Send Feedback</DialogTitle>
            <DialogDescription className="text-center sm:text-left">
              Help us improve BaloerDev CV Analyzer by sharing your thoughts.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Your feedback..."
              className="min-h-[100px] w-full"
            />
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={() => setShowFeedback(false)}
                className="w-full sm:w-auto rounded-lg border-2 border-border bg-bg px-4 py-2 font-heading text-sm font-medium text-text shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedbackDialog}
                className="w-full sm:w-auto rounded-lg border-2 border-border bg-primary px-4 py-2 font-heading text-sm font-medium text-text shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                Submit
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}

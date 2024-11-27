import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-border bg-bg py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
  
          <div className="text-center text-sm text-text/80">
            <p>© {new Date().getFullYear()} BaloerDev. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-border bg-bg py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          {/* <div className="flex items-center gap-2">
            <span className="font-heading text-sm">Built with ❤️ by</span>
            <Link 
              href="https://github.com/akbarsaputrait" 
              target="_blank"
              className="font-heading text-sm hover:underline"
            >
              BaloerDev
            </Link>
          </div> */}
          
          {/* <div className="flex items-center gap-4">
            <Link
              href="https://github.com/akbarsaputrait"
              target="_blank"
              className="hover:opacity-80"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com/akbarsaputrait"
              target="_blank"
              className="hover:opacity-80"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </div> */}
          
          <div className="text-center text-sm text-text/80">
            <p>© {new Date().getFullYear()} BaloerDev. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

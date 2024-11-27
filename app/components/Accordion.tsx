'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
      <button
        className="w-full flex justify-between items-center bg-main"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-heading text-text px-6 py-4">{title}</h3>
        <ChevronDown
          className={`w-5 h-5 text-text transform transition-transform duration-200 mr-6 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <CardContent className="px-6 py-4 border-t-2 border-border">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

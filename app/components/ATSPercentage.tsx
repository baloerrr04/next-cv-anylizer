'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";

interface ATSPercentageProps {
  percentage: number;
}

export default function ATSPercentage({ percentage }: ATSPercentageProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500; // Animation duration in milliseconds
    const steps = 60; // Number of steps in the animation
    const increment = percentage / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setCount(percentage);
        clearInterval(timer);
      } else {
        setCount((prev) => Math.min(prev + increment, percentage));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [percentage]);

  const getColor = () => {
    if (percentage >= 80) return '#22c55e'; // Success green
    if (percentage >= 60) return '#f59e0b'; // Warning yellow
    return '#ef4444'; // Error red
  };

  return (
    <Card className="border-2 border-border bg-main p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-heading text-text mb-4">ATS Score</h3>
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${count * 2.83}, 283`}
              transform="rotate(-90 50 50)"
              style={{
                transition: 'stroke-dasharray 1s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-heading" style={{ color: getColor() }}>
              {Math.round(count)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

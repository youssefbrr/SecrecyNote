"use client";

import { useEffect, useState } from "react";

interface ExpirationChartProps {
  distribution: Record<string, number>;
}

export function ExpirationChart({ distribution }: ExpirationChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || Object.keys(distribution).length === 0) {
    return (
      <div className='h-32 flex items-center justify-center text-muted-foreground text-sm'>
        No data available
      </div>
    );
  }

  const total = Object.values(distribution).reduce(
    (sum, count) => sum + count,
    0
  );
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  return (
    <div className='space-y-3'>
      {Object.entries(distribution).map(([type, count], index) => {
        const percentage = Math.round((count / total) * 100);
        return (
          <div key={type} className='space-y-1'>
            <div className='flex justify-between text-xs'>
              <span className='flex items-center'>
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    colors[index % colors.length]
                  } mr-1.5`}
                ></span>
                {type}
              </span>
              <span className='font-medium'>{percentage}%</span>
            </div>
            <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
              <div
                className={`h-full ${colors[index % colors.length]}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

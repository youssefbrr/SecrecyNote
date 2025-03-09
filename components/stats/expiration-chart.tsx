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

  // Color mapping for different expiration types
  const colors: Record<string, string> = {
    never: "bg-green-500",
    time: "bg-blue-500",
    view: "bg-amber-500",
    expired: "bg-red-500",
  };

  // Default colors for any other type
  const defaultColors = [
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
  ];

  // Friendly names for expiration types
  const getExpirationTypeName = (type: string): string => {
    switch (type) {
      case "never":
        return "Never Expires";
      case "time":
        return "Time-based";
      case "view":
        return "View-based";
      case "expired":
        return "Expired";
      default:
        return type;
    }
  };

  // Sort the types to have a consistent order - 'never' first, 'expired' last
  const sortOrder: Record<string, number> = {
    never: 1,
    time: 2,
    view: 3,
    expired: 4,
  };

  const sortedEntries = Object.entries(distribution).sort((a, b) => {
    const orderA = sortOrder[a[0]] || 999;
    const orderB = sortOrder[b[0]] || 999;
    return orderA - orderB;
  });

  return (
    <div className='space-y-3'>
      {sortedEntries.map(([type, count], index) => {
        const percentage = Math.round((count / total) * 100);
        const colorClass =
          colors[type] || defaultColors[index % defaultColors.length];

        return (
          <div key={type} className='space-y-1'>
            <div className='flex justify-between text-xs'>
              <span className='flex items-center'>
                <span
                  className={`inline-block w-2 h-2 rounded-full ${colorClass} mr-1.5`}
                ></span>
                {getExpirationTypeName(type)}
              </span>
              <span className='font-medium'>{percentage}%</span>
            </div>
            <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
              <div
                className={`h-full ${colorClass}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

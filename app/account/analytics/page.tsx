"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { ExpirationChart } from "@/components/stats/expiration-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Loader2, Lock, Text } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface NoteAnalytics {
  totalNotes: number;
  notesByMonth: Record<string, number>;
  passwordProtectedByMonth: Record<string, number>;
  contentStats: {
    avgContentLength: number;
    maxContentLength: number;
  };
  activityByDayOfWeek: number[];
  expireTypesCount: Record<string, number>;
}

export default function AnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [analytics, setAnalytics] = useState<NoteAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect("/");
    }

    if (isAuthenticated) {
      fetchNoteAnalytics(period);
    }
  }, [isLoading, isAuthenticated, period]);

  const fetchNoteAnalytics = async (selectedPeriod: string) => {
    setLoadingAnalytics(true);
    try {
      const response = await fetch(
        `/api/analytics/notes?period=${selectedPeriod}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        console.error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const dayOfWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (isLoading) {
    return (
      <div className='container flex items-center justify-center min-h-[60vh]'>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='container py-8 max-w-4xl'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Note Analytics</h1>
          <p className='text-muted-foreground mt-1'>
            Detailed insights into your note usage patterns
          </p>
        </div>
        <Link href='/account'>
          <Button variant='outline'>Back to Account</Button>
        </Link>
      </div>

      <div className='mb-6'>
        <Tabs
          defaultValue='all'
          value={period}
          onValueChange={setPeriod}
          className='w-full'
        >
          <TabsList>
            <TabsTrigger value='week'>Last Week</TabsTrigger>
            <TabsTrigger value='month'>Last Month</TabsTrigger>
            <TabsTrigger value='year'>Last Year</TabsTrigger>
            <TabsTrigger value='all'>All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loadingAnalytics ? (
        <div className='py-12 flex justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      ) : analytics ? (
        <div className='space-y-6'>
          {/* Summary Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  Total Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-baseline justify-between'>
                  <div className='text-3xl font-bold'>
                    {analytics.totalNotes}
                  </div>
                  <FileText className='h-5 w-5 text-muted-foreground' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  Avg. Content Length
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-baseline justify-between'>
                  <div className='text-3xl font-bold'>
                    {analytics.contentStats.avgContentLength}
                  </div>
                  <Text className='h-5 w-5 text-muted-foreground' />
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  characters per note
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  Password Protected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-baseline justify-between'>
                  <div className='text-3xl font-bold'>
                    {analytics.totalNotes > 0
                      ? Math.round(
                          (Object.values(analytics.expireTypesCount).reduce(
                            (sum, count) => sum + count,
                            0
                          ) /
                            analytics.totalNotes) *
                            100
                        ) + "%"
                      : "0%"}
                  </div>
                  <Lock className='h-5 w-5 text-muted-foreground' />
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  of all notes
                </p>
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Expiration Types Chart */}
            <Card className='md:col-span-1'>
              <CardHeader>
                <CardTitle>Expiration Types</CardTitle>
                <CardDescription>
                  Distribution of note expiration settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpirationChart distribution={analytics.expireTypesCount} />
              </CardContent>
            </Card>

            {/* Day of Week Activity */}
            <Card className='md:col-span-1'>
              <CardHeader>
                <CardTitle>Day of Week Activity</CardTitle>
                <CardDescription>
                  Note creation frequency by day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {analytics.activityByDayOfWeek.map((count, index) => {
                    const percentage =
                      analytics.totalNotes > 0
                        ? Math.round((count / analytics.totalNotes) * 100)
                        : 0;

                    return (
                      <div key={index} className='space-y-1'>
                        <div className='flex justify-between text-xs'>
                          <span>{dayOfWeekNames[index]}</span>
                          <span className='font-medium'>{count} notes</span>
                        </div>
                        <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
                          <div
                            className='h-full bg-primary'
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>Notes created over time</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(analytics.notesByMonth).length > 0 ? (
                <div className='space-y-3'>
                  {Object.entries(analytics.notesByMonth)
                    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
                    .slice(-12) // Show last 12 months
                    .map(([month, count]) => {
                      const [year, monthNum] = month.split("-");
                      const label = `${new Date(
                        parseInt(year),
                        parseInt(monthNum) - 1
                      ).toLocaleString("default", { month: "short" })} ${year}`;
                      const maxCount = Math.max(
                        ...Object.values(analytics.notesByMonth)
                      );
                      const percentage =
                        maxCount > 0 ? (count / maxCount) * 100 : 0;

                      return (
                        <div key={month} className='space-y-1'>
                          <div className='flex justify-between text-xs'>
                            <span>{label}</span>
                            <span className='font-medium'>{count} notes</span>
                          </div>
                          <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
                            <div
                              className='h-full bg-blue-500'
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className='py-8 text-center text-muted-foreground'>
                  No monthly data available for the selected period
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className='py-12 text-center'>
          <p className='text-muted-foreground'>Failed to load analytics data</p>
        </div>
      )}
    </div>
  );
}

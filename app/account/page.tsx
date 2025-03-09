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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart,
  Calendar,
  CalendarClock,
  Clock,
  FileIcon,
  KeyRound,
  Loader2,
  LockIcon,
  ScrollText,
  Text,
  UnlockIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, updateProfile, updatePassword } =
    useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [stats, setStats] = useState<{
    totalNotes: number;
    activeNotes: number;
    expiredNotes: number;
    memberSince: string | null;
    lastActivity: string | null;
    accountUpdated: string | null;
    passwordProtectedNotes: number;
    passwordProtectionRate: number;
    expirationDistribution: Record<string, number>;
    recentNotesCount: number;
    avgContentLength: number;
    maxContentLength: number;
    latestNotes: Array<{
      id: string;
      title: string;
      created: string;
      updated: string;
      isPasswordProtected: boolean;
      isExpired: boolean;
      expirationType: string;
      contentLength: number;
    }>;
  }>({
    totalNotes: 0,
    activeNotes: 0,
    expiredNotes: 0,
    memberSince: null,
    lastActivity: null,
    accountUpdated: null,
    passwordProtectedNotes: 0,
    passwordProtectionRate: 0,
    expirationDistribution: {},
    recentNotesCount: 0,
    avgContentLength: 0,
    maxContentLength: 0,
    latestNotes: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect("/");
    }

    console.log("User object changed:", user);
    if (user?.name !== undefined) {
      console.log("Setting name state from user object:", user.name);
      setName(user.name || "");
    }

    if (isAuthenticated) {
      fetchUserStats();
    }
  }, [isLoading, isAuthenticated, user]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/user/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    console.log("Submitting profile update with name:", name);

    try {
      const result = await updateProfile(name);
      console.log("Profile update result:", result);

      if (result.success) {
        if (result.data?.name !== undefined) {
          console.log("Updating name state from result:", result.data.name);
          setName(result.data.name || "");
        }

        toast({
          title: "Profile updated",
          description:
            "Your profile information has been updated successfully.",
        });
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password fields
    if (!currentPassword || !newPassword) {
      toast({
        title: "Missing fields",
        description: "Current password and new password are required.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      });
      return;
    }

    setSavingPassword(true);

    try {
      const result = await updatePassword(currentPassword, newPassword);

      if (result.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        });
      } else {
        // Handle specific error messages based on status code
        if (result.status === 401) {
          throw new Error("Current password is incorrect.");
        } else if (result.status === 400) {
          throw new Error(result.error || "Invalid password format.");
        } else {
          throw new Error(result.error || "Failed to update password.");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while updating your password",
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

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
    <div className='container py-8 max-w-3xl'>
      <div className='flex items-center mb-8'>
        <User className='w-8 h-8 mr-3 text-primary' />
        <h1 className='text-3xl font-bold'>Account Settings</h1>
      </div>

      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='profile'>Profile Information</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
          <TabsTrigger value='stats'>Account Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value='profile'>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and how it appears
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate}>
                <div className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      value={user?.email || ""}
                      disabled
                      className='bg-muted/50'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Your email address cannot be changed
                    </p>
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                      id='name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder='Your name'
                      className={
                        name.trim().length > 50 ? "border-red-500" : ""
                      }
                    />
                    {name.trim().length > 50 && (
                      <p className='text-xs text-red-500'>
                        Name cannot exceed 50 characters
                      </p>
                    )}
                    {name.trim() &&
                      !/^[a-zA-Z0-9\s-'.]+$/.test(name.trim()) && (
                        <p className='text-xs text-red-500'>
                          Name contains invalid characters
                        </p>
                      )}
                    <p className='text-xs text-muted-foreground'>
                      Use only letters, numbers, spaces, and these characters: -
                      ' .
                    </p>
                  </div>

                  <div className='flex justify-end'>
                    <Button
                      type='submit'
                      disabled={
                        savingProfile ||
                        name.trim().length > 50 ||
                        (name.trim() !== "" &&
                          !/^[a-zA-Z0-9\s-'.]+$/.test(name.trim()))
                      }
                    >
                      {savingProfile && (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      )}
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security'>
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate}>
                <div className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='current-password'>Current Password</Label>
                    <Input
                      id='current-password'
                      type='password'
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='new-password'>New Password</Label>
                    <Input
                      id='new-password'
                      type='password'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <div className='text-xs text-muted-foreground space-y-1 mt-1'>
                      <p>Password must:</p>
                      <ul className='list-disc pl-4'>
                        <li
                          className={
                            newPassword.length >= 8 ? "text-green-500" : ""
                          }
                        >
                          Be at least 8 characters long
                        </li>
                        <li
                          className={
                            /[A-Z]/.test(newPassword) ? "text-green-500" : ""
                          }
                        >
                          Contain at least one uppercase letter
                        </li>
                        <li
                          className={
                            /[a-z]/.test(newPassword) ? "text-green-500" : ""
                          }
                        >
                          Contain at least one lowercase letter
                        </li>
                        <li
                          className={
                            /[\d!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                              ? "text-green-500"
                              : ""
                          }
                        >
                          Contain at least one number or special character
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='confirm-password'>
                      Confirm New Password
                    </Label>
                    <Input
                      id='confirm-password'
                      type='password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className='text-xs text-red-500'>
                        Passwords don't match
                      </p>
                    )}
                  </div>

                  <div className='flex justify-end'>
                    <Button
                      type='submit'
                      disabled={
                        savingPassword ||
                        !currentPassword ||
                        !newPassword ||
                        newPassword !== confirmPassword ||
                        newPassword.length < 8 ||
                        !/[A-Z]/.test(newPassword) ||
                        !/[a-z]/.test(newPassword) ||
                        !/[\d!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                      }
                    >
                      {savingPassword && (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      )}
                      {savingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='stats'>
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>
                Overview of your account activity and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className='py-4 flex justify-center'>
                  <Loader2 className='w-6 h-6 animate-spin text-primary' />
                </div>
              ) : (
                <div className='space-y-8'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center space-x-4 p-4 border rounded-md'>
                      <div className='p-2 bg-primary/10 rounded-full'>
                        <FileIcon className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>Total Notes</p>
                        <p className='text-2xl font-bold'>{stats.totalNotes}</p>
                        <p className='text-xs text-muted-foreground'>
                          {stats.activeNotes} active, {stats.expiredNotes}{" "}
                          expired
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-4 p-4 border rounded-md'>
                      <div className='p-2 bg-primary/10 rounded-full'>
                        <CalendarClock className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>Member Since</p>
                        <p className='text-2xl font-bold'>
                          {stats.memberSince
                            ? new Date(stats.memberSince).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-4 p-4 border rounded-md'>
                      <div className='p-2 bg-primary/10 rounded-full'>
                        <Clock className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>Last Activity</p>
                        <p className='text-lg font-bold'>
                          {stats.lastActivity
                            ? new Date(stats.lastActivity).toLocaleDateString()
                            : "No activity yet"}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-4 p-4 border rounded-md'>
                      <div className='p-2 bg-primary/10 rounded-full'>
                        <BarChart className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>Recent Activity</p>
                        <p className='text-lg font-bold'>
                          {stats.recentNotesCount} notes in the last 30 days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Password Protected and Expiration Distribution */}
                  <div>
                    <h3 className='text-lg font-medium mb-3'>
                      Note Security Distribution
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='p-4 border rounded-md'>
                        <div className='flex items-center mb-2'>
                          <LockIcon className='h-4 w-4 mr-2 text-primary' />
                          <h4 className='font-medium'>Password Protection</h4>
                        </div>
                        <div className='flex justify-between mt-3'>
                          <div>
                            <p className='text-sm'>Protected</p>
                            <p className='text-xl font-bold'>
                              {stats.passwordProtectedNotes}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm'>Unprotected</p>
                            <p className='text-xl font-bold'>
                              {stats.totalNotes - stats.passwordProtectedNotes}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm'>Protection Rate</p>
                            <p className='text-xl font-bold'>
                              {stats.passwordProtectionRate}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='p-4 border rounded-md'>
                        <div className='flex items-center mb-2'>
                          <Calendar className='h-4 w-4 mr-2 text-primary' />
                          <h4 className='font-medium'>Expiration Types</h4>
                        </div>
                        <div className='mt-3'>
                          <ExpirationChart
                            distribution={stats.expirationDistribution}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add content length stats */}
                  <div className='p-4 border rounded-md mt-4'>
                    <div className='flex items-center mb-2'>
                      <Text className='h-4 w-4 mr-2 text-primary' />
                      <h4 className='font-medium'>Content Statistics</h4>
                    </div>
                    <div className='flex justify-between mt-3'>
                      <div>
                        <p className='text-sm'>Avg. Length</p>
                        <p className='text-xl font-bold'>
                          {stats.avgContentLength} chars
                        </p>
                      </div>
                      <div>
                        <p className='text-sm'>Max Length</p>
                        <p className='text-xl font-bold'>
                          {stats.maxContentLength} chars
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Latest Notes */}
                  {stats.latestNotes.length > 0 && (
                    <div>
                      <h3 className='text-lg font-medium mb-3'>Recent Notes</h3>
                      <div className='border rounded-md overflow-hidden'>
                        <div className='bg-muted px-4 py-2'>
                          <div className='grid grid-cols-12 gap-2 text-sm font-medium'>
                            <div className='col-span-5'>Title</div>
                            <div className='col-span-2'>Created</div>
                            <div className='col-span-1'>Length</div>
                            <div className='col-span-2'>Status</div>
                            <div className='col-span-2'>Security</div>
                          </div>
                        </div>
                        <div className='divide-y'>
                          {stats.latestNotes.map((note) => (
                            <div
                              key={note.id}
                              className='grid grid-cols-12 gap-2 px-4 py-3 text-sm'
                            >
                              <div className='col-span-5 font-medium truncate'>
                                <Link
                                  href={`/view/${note.id}`}
                                  className='hover:text-primary transition-colors flex items-center'
                                >
                                  <ScrollText className='h-4 w-4 mr-2 inline opacity-70' />
                                  {note.title}
                                </Link>
                              </div>
                              <div className='col-span-2 text-muted-foreground'>
                                {new Date(note.created).toLocaleDateString()}
                              </div>
                              <div className='col-span-1 text-muted-foreground'>
                                {note.contentLength}
                              </div>
                              <div className='col-span-2'>
                                {note.isExpired ? (
                                  <span className='inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive'>
                                    Expired
                                  </span>
                                ) : (
                                  <span className='inline-flex items-center rounded-full bg-green-100 dark:bg-green-500/20 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400'>
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className='col-span-2'>
                                {note.isPasswordProtected ? (
                                  <span className='inline-flex items-center'>
                                    <LockIcon className='h-3.5 w-3.5 mr-1 text-amber-500' />
                                    <span className='text-xs'>Protected</span>
                                  </span>
                                ) : (
                                  <span className='inline-flex items-center'>
                                    <UnlockIcon className='h-3.5 w-3.5 mr-1 text-muted-foreground' />
                                    <span className='text-xs text-muted-foreground'>
                                      Open
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className='flex justify-end mt-4'>
                    <Link href='/account/analytics'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex items-center'
                      >
                        <BarChart className='h-4 w-4 mr-2' />
                        View Detailed Analytics
                      </Button>
                    </Link>
                  </div>

                  <div className='bg-muted/40 p-4 rounded-md'>
                    <div className='flex items-start space-x-2'>
                      <KeyRound className='h-5 w-5 text-primary mt-0.5' />
                      <div>
                        <h3 className='font-medium'>Security Tip</h3>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Remember to use a strong, unique password and change
                          it regularly. Your encrypted notes are only as secure
                          as the password protecting them.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

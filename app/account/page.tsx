"use client";

import { useAuth } from "@/components/providers/auth-provider";
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
import { CalendarClock, FileIcon, KeyRound, Loader2, User } from "lucide-react";
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
    memberSince: string | null;
  }>({
    totalNotes: 0,
    memberSince: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect("/");
    }

    if (user?.name) {
      setName(user.name);
    }

    // Fetch user stats
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

    try {
      const success = await updateProfile(name);

      if (success) {
        toast({
          title: "Profile updated",
          description:
            "Your profile information has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
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
      const success = await updatePassword(currentPassword, newPassword);

      if (success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        });
      } else {
        throw new Error(
          "Failed to update password. Please check your current password."
        );
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
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
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
                    />
                  </div>

                  <div className='flex justify-end'>
                    <Button type='submit' disabled={savingProfile}>
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
                  </div>

                  <div className='flex justify-end'>
                    <Button type='submit' disabled={savingPassword}>
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
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center space-x-4 p-4 border rounded-md'>
                      <div className='p-2 bg-primary/10 rounded-full'>
                        <FileIcon className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>Total Notes</p>
                        <p className='text-2xl font-bold'>{stats.totalNotes}</p>
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

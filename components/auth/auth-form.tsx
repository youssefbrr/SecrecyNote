"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function AuthForm() {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(loginEmail, loginPassword);
      if (!success) {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await register(
        registerEmail,
        registerPassword,
        registerName
      );
      if (!success) {
        setError("Registration failed. Email may already be in use.");
      }
    } catch (error) {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue='login' className='w-full max-w-md'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='login'>Login</TabsTrigger>
        <TabsTrigger value='register'>Register</TabsTrigger>
      </TabsList>

      <TabsContent value='login'>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Access your secure notes with your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='login-email'>Email</Label>
                <Input
                  id='login-email'
                  type='email'
                  placeholder='your@email.com'
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='login-password'>Password</Label>
                <Input
                  id='login-password'
                  type='password'
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              {error && <div className='text-sm text-red-500'>{error}</div>}
            </CardContent>
            <CardFooter>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Login...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value='register'>
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Create a new account to save and manage your secure notes
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='register-email'>Email</Label>
                <Input
                  id='register-email'
                  type='email'
                  placeholder='your@email.com'
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='register-name'>Name (optional)</Label>
                <Input
                  id='register-name'
                  type='text'
                  placeholder='Your Name'
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='register-password'>Password</Label>
                <Input
                  id='register-password'
                  type='password'
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              {error && <div className='text-sm text-red-500'>{error}</div>}
            </CardContent>
            <CardFooter>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

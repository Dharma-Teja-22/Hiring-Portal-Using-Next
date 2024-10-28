"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function Signup() {
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
  });
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!data.first_name || data.first_name.length < 4) {
      toast.error("First name must be at least 4 characters long");
      return;
    }
    if (!data.last_name || data.last_name.length < 4) {
      toast.error("Last name must be at least 4 characters long");
      return;
    }
    if (!data.email.includes("@")) {
      toast.error("Invalid email address");
      return;
    }
    if (!data.password || data.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!data.role) {
      toast.error("Role is required");
      return;
    }

    console.log("Button clicked! Form data:", data);
    setData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "",
    });

    const response = await fetch("/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

    if (response) {
      toast.success("Successfully Registered");
      router.push('/login'); 
    } else {
      toast.error("Check your credentials");
    }
  };

  return (
    <div className="flex h-screen w-screen justify-center place-items-center bg-gray-900" >
      <div>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <Card className="mx-auto max-w-sm mt-10 mb-10 rounded-[14px]  shadow-[-10px_12px_20px_gray,_-2px_5px_10px_white]">
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                      id="first_name"
                      placeholder="Max"
                      value={data.first_name}
                      onChange={(e) =>
                        setData({ ...data, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                      id="last_name"
                      placeholder="Robinson"
                      value={data.last_name}
                      onChange={(e) =>
                        setData({ ...data, last_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-5">
                  <Label>Role</Label>
                  <Label className="flex gap-3">
                    <input
                      type="radio"
                      value="Manager"
                      name="role"
                      checked={data.role === "Manager"}
                      onChange={(e) => setData({ ...data, role: e.target.value })}
                    />
                    Manager
                  </Label>
                  <Label className="flex gap-3">
                    <input
                      type="radio"
                      value="Candidate"
                      name="role"
                      checked={data.role === "Candidate"}
                      onChange={(e) => setData({ ...data, role: e.target.value })}
                    />
                    Candidate
                  </Label>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create an account
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href='/login' className="underline">Login</Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

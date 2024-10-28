"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCookies } from 'next-client-cookies';

export default function Login() {

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "",
    first_name:"",
    last_name:"",
  });

//   const [loginData, setLoginData] = useState({
//     email: "dt@ms.com",
//     password: "Dharma@22",
//     role: "Manager",
//     first_name:"",
//     last_name:"",
//   });

  const router = useRouter();
  const cookies = useCookies();
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    if (!loginData.email || !loginData.password || !loginData.role) {
      toast.error("Please fill in all fields", { autoClose: 3000 });
      return "Error- Fill the Fields";
    }
  
    const response = await fetch("/auth", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
  
    if (response.ok) {
      const { msg } = await response.json();
    //   console.log(msg, "Msg from Login")
      toast.success(msg, { autoClose: 1000 }); 
      cookies.set("userEmail", loginData.email);
      cookies.set("firstName", msg.firstName);
      cookies.set("lastName", msg.lastName);
      cookies.set("token",msg.token)

    //   localStorage.setItem("userEmail", loginData.email);
    //   localStorage.setItem("firstName", msg.firstName);
    //   localStorage.setItem("lastName", msg.lastName);
  
      setTimeout(() => {
        if (loginData.role === "Manager")
        {
            cookies.set("managerId", msg.id);
            // localStorage.setItem("managerId", msg.id);
            toast.success("Login Successful", { autoClose: 2500 });
            router.push("/manager");
        } 
        else {
            cookies.set("candidateId", msg.id);
            // localStorage.setItem("candidateId", msg.id);
            toast.success("Login Successful", { autoClose: 2500 });
            router.push("/candidate");
        }
      }, 100);
    } 
    else 
    {
      const errorMessage = await response.json();
      toast.error(errorMessage.message || "Invalid credentials", { autoClose: 3000 });
    }
  
    setLoginData({
      email: "",
      password: "",
      role: "",
    });
  };

  return (
    
    <div className="flex h-screen w-screen place-items-center justify-center bg-gray-900">
      <ToastContainer />
      <div>
        <form onSubmit={handleSubmit}>
          <Card className="mx-auto w-full max-w-sm h-full mt-10 mb-10 border border-r-8 rounded-[14px]  shadow-[-10px_12px_20px_gray,_-2px_5px_10px_white] ">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Login</CardTitle>
              <CardDescription>
                Enter your email and password below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="enter password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>

              <div className="flex gap-6 justify-center">
                <Label>Role</Label>
                <Label className="flex gap-3">
                  <input
                    type="radio"
                    value="Manager"
                    name="role"
                    checked={loginData.role === "Manager"}
                    onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                    required
                  />
                  Manager
                </Label>
                <Label className="flex gap-3">
                  <input
                    type="radio"
                    value="Candidate"
                    name="role"
                    checked={loginData.role === "Candidate"}
                    onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                    required
                  />
                  Candidate
                </Label>
              </div>
              <Button className="w-full mt-2">Sign in</Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="underline">Sign up</Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

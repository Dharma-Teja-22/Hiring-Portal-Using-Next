"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'; 
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplyJobPage = () => {
  const router = useRouter();
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    candidate_id: null,
    job_title: '',
    job_id: null,
    resume_url: '',
  });

  useEffect(() => {
    setData({
      firstName: localStorage.getItem("firstName") || '',
      lastName: localStorage.getItem("lastName") || '',
      candidate_id: Number(localStorage.getItem("candidateId")) || null,
      job_title: localStorage.getItem("selectedJobTitle") || '',
      job_id: Number(localStorage.getItem("selectedJobId")) || null,
      resume_url: '',
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Button clicked! Form data:", data);

    try {
      const status = await fetch("/candidate/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
    body: JSON.stringify(data),
      });

      if (status != null) {
        toast.success('Application submitted successfully!', { autoClose: 1000 });
        setTimeout(() => router.back(), 1000);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      toast.error('Failed to submit application. Please try again.', { autoClose: 1000 });
      setTimeout(() => router.back(), 1000);
    }

    // Clear resume URL after submission
    setData((prevData) => ({ ...prevData, resume_url: '' }));
  };

  return (
    <div className="bg-gray-900 h-screen">
      <ToastContainer />
      <div className="flex items-center ml-10">
        <button onClick={() => router.back()} className="text-4xl text-blue-500 hover:text-blue-600 transition">
          ← 
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex w-screen justify-center place-items-center mb-4">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="text-xl flex justify-center">Job Application</CardTitle>
            <CardDescription>Enter Information to apply for Job</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" type="text" value={data.firstName} required readOnly />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={data.lastName} required readOnly />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="candidate_id">Candidate ID</Label>
                <Input id="candidate_id" type="number" value={data.candidate_id} required readOnly />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input id="job_title" type="text" value={data.job_title} required readOnly />
              </div>

             

              <div className="grid gap-2">
                <Label htmlFor="resume_url">Resume URL</Label>
                <Input
                  id="resume_url"
                  type="text"
                  value={data.resume_url}
                  onChange={(e) => setData({ ...data, resume_url: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">Apply for Job</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ApplyJobPage;

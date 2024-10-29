"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'; 
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from 'next-client-cookies';
import { ArrowLeft } from "lucide-react"

const ApplyJobPage = () => {
  const router = useRouter();
  const cookies = useCookies();

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
      firstName: cookies.get("firstName") || '',
      lastName: cookies.get("lastName") || '',
      candidate_id: Number(cookies.get("candidateId")) || null,
      job_title: cookies.get("selectedJobTitle") || '',
      job_id: Number(cookies.get("selectedJobId")) || null,
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
    <div className="bg-gray-900 h-screen ">
      <ToastContainer />
      <div className="flex items-center ml-10">
        {/* <button onClick={() => router.back()} className="text-2xl mt-2 text-blue-500 hover:text-blue-600 transition">
          ← 
        </button> */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-blue-500 hover:text-blue-600 transition mt-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg">Back</span>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex justify-center  ">
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

              {/* <div className="grid gap-2">
                <Label htmlFor="candidate_id">Candidate ID</Label>
                <Input id="candidate_id" type="number" value={data.candidate_id} required readOnly />
              </div> */}

              <div className="grid gap-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input id="job_title" type="text" value={data.job_title} required readOnly />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sills">Skills</Label>
                <Input id="skills" type="text" required/>
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

              <button
                type="submit"
                class="flex text-sm justify-center gap-2 items-center mx-auto shadow-xl  bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-200  before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-gray-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
              >
                Apply for job
                <svg
                  class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    class="fill-gray-800 group-hover:fill-gray-800"
                  ></path>
                </svg>
              </button>
              {/* <Button type="submit" className="w-full">Apply for Job</Button> */}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ApplyJobPage;

"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Page = () => {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  const candidate_id = typeof window !== 'undefined' ? localStorage.getItem("candidateId") : null;

  useEffect(() => {
    const fetchJobs = async () => {
      if (candidate_id) {
        try {
          const response = await fetch("/candidate/api", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ candidate_id }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch jobs");
          }

          const data = await response.json();
          setJobs(data.msg); // Assuming the response contains job data
        } catch (error) {
          console.error("Error fetching jobs:", error);
          toast.error("Failed to fetch jobs");
        }
      }
    };

    fetchJobs();
  }, [candidate_id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center ml-4">
        <button 
          onClick={() => router.back()} 
          className="text-2xl text-blue-500 hover:text-blue-600 transition"
        >
          ← 
        </button>
      </div>
      <div className="container mx-auto">
        <ToastContainer />
        <h1 className="text-2xl font-bold mb-6 text-center">Selected Jobs</h1>
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-xs font-bold text-gray-600 text-center tracking-wider">Job Title</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-bold text-gray-600 tracking-wider">Description</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-bold text-gray-600 tracking-wider">Salary</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-bold text-gray-600 tracking-wider">Location</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-bold text-gray-600 tracking-wider">Application Deadline</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-bold text-gray-600 tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr 
                    key={job.job_id} 
                    className={`hover:bg-gray-100 ${job.status === 'Selected' ? 'text-green-600' : ''}`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">{job.title}</td>
                    <td className="px-4 py-4  text-sm text-gray-500">{job.description}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">${job.salary}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">{job.location}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {new Date(job.application_deadline).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {job.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No applied jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;

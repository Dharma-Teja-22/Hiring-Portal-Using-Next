"use client";

import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCookies } from 'next-client-cookies';

const Page = () => {
  const [jobs, setJobs] = useState([]);
  const [statusMessages, setStatusMessages] = useState({});
  const [loadingJobId, setLoadingJobId] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({ date: '', duration: '' });
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const cookies = useCookies();

  const candidate_id = cookies.get("candidateId");

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

  const fetchJobStatus = async (job_id) => {
    if (candidate_id) {
      try {
        setLoadingJobId(job_id);
        // localStorage.setItem("jobId", String(job_id));
        const response = await fetch("/candidate/api/job_status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ candidate_id, job_id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job status");
        }

        const statusData = await response.json();
        setStatusMessages((prev) => ({ ...prev, [job_id]: statusData.msg }));
        setLoadingJobId(null);

        if (statusData.msg === "Pending") {
          toast.info(statusData.msg);
        } else if (["Interview", "Selected", "Rejected"].includes(statusData.msg)) {
          toast.success(statusData.msg);
        }
      } catch (error) {
        console.error("Error fetching job status:", error);
        setStatusMessages((prev) => ({ ...prev, [job_id]: "Error fetching job status." }));
        setLoadingJobId(null);
      }
    }
  };

  const handleInterviewDetails = async (jobId) => {
    const candidateId = cookies.get("candidateId");
    const data = { candidate_id: candidateId, job_id: jobId };
      try {
      const response = await fetch("/candidate/api", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const responseData = await response.json();
      const { msg } = responseData;
  
      if (msg) {
        setInterviewDetails({
          date: msg.interview_date,
          duration: msg.Duration,
        });
        setShowModal(true); // Show the modal with interview details
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };
  

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex items-center ml-4">
        <button onClick={() => router.back()} className="text-2xl text-blue-500 hover:text-blue-600 transition">
          ← 
        </button>
      </div>
      <div className="container mx-auto">
        <ToastContainer />
        <h1 className="text-2xl font-bold mb-6 text-center">Applied Jobs</h1>
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-xs font-bold text-gray-600 text-center tracking-wider">Job Title</th>
                  <th className="w-1/4 px-4 py-3 border-b-2 border-gray-200 text-xs font-bold text-gray-600 text-center tracking-wider">Description</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-bold text-gray-600 tracking-wider">Salary</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-bold text-gray-600 tracking-wider">Location</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-bold text-gray-600 tracking-wider">Application Deadline</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-bold text-gray-600 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.job_id} className="hover:bg-gray-100">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">{job.title}</td>
                    <td className="w-3/4 px-4 py-4 whitespace-wrap text-sm text-gray-500">{job.description}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">₹ {job.salary}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">{job.location}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {new Date(job.application_deadline).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {job.status === "In-Progress" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInterviewDetails(job.job_id);
                          }}
                          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 w-36"
                        >
                          Interview Details
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!loadingJobId) {
                              fetchJobStatus(job.job_id);
                            }
                          }}
                          className={`px-4 py-2 rounded flex justify-center items-center w-36 ${
                            statusMessages[job.job_id] === "Error fetching job status."
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          } text-white`}
                          disabled={loadingJobId === job.job_id || statusMessages[job.job_id]?.includes("Interview")}
                        >
                          {loadingJobId === job.job_id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM2 12a10 10 0 0010 10v-4a6 6 0 01-6-6H2z"></path>
                            </svg>
                          ) : statusMessages[job.job_id] ? (
                            statusMessages[job.job_id] === "Error fetching job status."
                              ? "Error"
                              : statusMessages[job.job_id]
                          ) : (
                            "Check Status"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No applied jobs found.</p>
        )}
        {Object.keys(statusMessages).length > 0 && (
          <div className="mt-4 text-center text-gray-700">
            <h1>{(loadingJobId !== null && loadingJobId !== undefined) && statusMessages[loadingJobId]}</h1>
          </div>
        )}
      </div>

      {/* Modal for Interview Details */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Interview Details</h3>
            <div className="mb-4">
              <strong>Date:</strong> {interviewDetails.date}
            </div>
            <div className="mb-4">
              <strong>Duration:</strong> {interviewDetails.duration}
            </div>
            <div className="flex justify-center mt-6">
              <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter();
  const candidateData = localStorage.getItem("candidateData");
  const { candidate_id, job_id } = JSON.parse(candidateData); // Destructure values
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    
    const fetchCandidate = async () => {
        if (!candidate_id || !job_id) {
          console.error("Candidate ID and Job ID are required.");
          return "DAta not found";
        }
      
        try {
          const response = await fetch(`/manager/api`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ candidate_id, job_id }),
          });
          
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
      
          const data = await response.json();
          setCandidate(data.msg);
        } catch (error) {
          console.error("Error fetching candidate:", error);
        }
      };      

    fetchCandidate();
  }, [candidate_id, job_id]);

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
      <ToastContainer />
      <div className="flex items-center mb-4">
        <button
          onClick={() => router.back()}
          className="text-xl text-blue-500 hover:text-blue-600 transition"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold ml-4 text-gray-800">
          {candidate.first_name} {candidate.last_name}
        </h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gray-400 mb-6 flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-white">
            {candidate.first_name.charAt(0)}
            {candidate.last_name.charAt(0)}
          </span>
        </div>
        <div className="text-center space-y-4">
          <p className="text-xl text-gray-700">
            <strong>Email:</strong> {candidate.email}
          </p>
          <p className="text-xl text-gray-700">
            <strong>Resume:</strong>{" "}
            {candidate.resume_url ? (
              <a
                href={candidate.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-600 transition"
              >
                View Resume
              </a>
            ) : (
              <span className="text-gray-500">No Resume Available</span>
            )}
          </p>
          <p className="text-xl font-bold text-gray-800 mt-4">
            <strong>Status:</strong> {candidate.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

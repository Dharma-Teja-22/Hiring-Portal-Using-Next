"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../../components/ui/card";
import { useCookies } from 'next-client-cookies';

const CandidatesPage = () => {
  const cookies = useCookies();
  const [candidates, setCandidates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCandidates = async () => {
      const manager_id = Number(cookies.get("managerId"));
      if (manager_id) {
        try {
          const response = await fetch("/manager/api", {
            method: "GET",
            headers: {
            //   "Content-Type": "application/json",
               Authorization: `Bearer ${cookies.get('token')}`
            },
          
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setCandidates(data.msg);
        } catch (error) {
          console.error("Error fetching candidates:", error);
        }
      }
    };

    fetchCandidates();
  }, []);

  const handleCardClick = (candidateId, jobId) => {
    const dataToStore = { candidate_id: candidateId, job_id: jobId };
    cookies.set("candidateData", JSON.stringify(dataToStore));
    
    router.push(`/manager/candidate_profile`);
  };

  if (candidates.length === 0) {
    return <div className="text-center p-6">No candidates available.</div>;
  }

  return (
    <>
      <div className="flex items-center mt-4 ml-4">
        <button
          onClick={() => router.back()}
          className="text-xl text-blue-500 hover:text-blue-600 transition"
        >
          ←
        </button>
      </div>
      <h1 className="text-2xl font-bold text-center mt-6 mb-4">Candidates</h1>
      <div className="h-full border-black flex flex-wrap justify-center p-6 gap-6">
        {candidates.map((candidate) => (
          <Card
            key={candidate.candidate_id}
            onClick={() =>
              handleCardClick(candidate.candidate_id, candidate.job_id)
            }
            className="p-4 m-4 w-full sm:w-80 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {candidate.first_name.charAt(0)}
                  {candidate.last_name.charAt(0)}
                </span>
              </div>
              <h2 className="text-lg font-bold text-center mb-2">{`${candidate.first_name} ${candidate.last_name}`}</h2>
              <h2 className="text-lg font-bold text-center mb-2">
                Job Title: {`${candidate.title}`}
              </h2>
              <p className="text-center text-gray-600 mb-2">
                Email: {candidate.email}
             
              </p>

              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                View Profile
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default CandidatesPage;

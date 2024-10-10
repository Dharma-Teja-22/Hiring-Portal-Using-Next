"use client";

import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [candidates, setCandidates] = useState([]);
  const managerId = Number(typeof window !== 'undefined' ? localStorage.getItem('managerId') : null);
  const router = useRouter();

  useEffect(() => {
    const fetchCandidates = async () => {
        const manager_id = Number(localStorage.getItem("managerId"));
        if (manager_id) {
          try {
            const response = await fetch("/manager/api", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ manager_id }),
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
  }, [managerId]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Interview':
        return 'text-green-600 bg-green-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleReject = async (candidate_id, job_id) => {
    try {
      const res = await APIs.put.UpdateCandidateStatus({
        candidate_id,
        job_id,
        status: 'Rejected',
        manager_id: managerId,
      });

      if (res === "Status already Rejected" || res === "Still posts are not closed!") {
        toast.warning(res);
      } else {
        toast.success('Candidate rejected successfully');
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.candidate_id === candidate_id && candidate.job_id === job_id
              ? { ...candidate, status: 'Rejected' }
              : candidate
          )
        );
      }
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      toast.error('Failed to reject candidate');
    }
  };

  const handleInterviewUpdate = async (candidate_id, job_id) => {
    try {
      const res = await APIs.put.UpdateCandidateStatus({
        candidate_id,
        job_id,
        status: 'Interview',
        manager_id: managerId,
      });

      if (res === "Status already is in Interview State" || res === "Still posts are not closed!") {
        toast.warning(res);
      } else {
        toast.success("Candidate assigned with Interview successfully");
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.candidate_id === candidate_id && candidate.job_id === job_id
              ? { ...candidate, status: 'Interview' }
              : candidate
          )
        );
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast.error('Failed to update candidate status');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()} className="text-xl text-blue-500 hover:text-blue-600 transition">
          ← 
        </button>
      </div>
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-bold mb-8 text-center">Candidates List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-gray-600 font-bold">First Name</th>
              <th className="py-3 px-6 text-left text-gray-600 font-bold">Last Name</th>
              <th className="py-3 px-6 text-left text-gray-600 font-bold">Email</th>
              <th className="py-3 px-6 text-left text-gray-600 font-bold">Job Title</th>
              <th className="py-3 px-6 text-left text-gray-600 font-bold">Status</th>
              <th className="py-3 px-6 text-center text-gray-600 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No candidates found.
                </td>
              </tr>
            ) : (
              candidates.map((candidate, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="py-4 px-6">{candidate.first_name}</td>
                  <td className="py-4 px-6">{candidate.last_name}</td>
                  <td className="py-4 px-6">{candidate.email}</td>
                  <td className="py-4 px-6">{candidate.title}</td>
                  <td className="py-4 px-6">
                    <span className={`py-1 px-3 rounded-full text-sm ${getStatusStyles(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {candidate.status === 'Pending' && (
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleInterviewUpdate(candidate.candidate_id, candidate.job_id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleReject(candidate.candidate_id, candidate.job_id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {(candidate.status === 'Interview' || candidate.status === 'Rejected') && (
                      <span className="text-gray-400">No Actions Available</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;

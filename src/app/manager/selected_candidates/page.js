"use client";

import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';

const Page = () => {
  const cookies = useCookies();
  const [candidates, setCandidates] = useState([]);
  const manager_id = Number(typeof window !== 'undefined' ? cookies.get('managerId') : null);
  const router = useRouter();

  useEffect(() => {
    const fetchCandidates = async () => {
      if (manager_id) {
        try {
          const response = await fetch("/manager/api/final_result_update", {
            method: "POST",
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
  }, [manager_id]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Interview':
        return 'text-green-600 bg-green-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Selected':
        return 'text green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
      <h1 className="text-3xl font-bold mb-8 text-center">Assign Final Result to the Candidates</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-center">
            <tr>
              <th className="py-3 px-6  text-gray-600 font-bold">First Name</th>
              <th className="py-3 px-6  text-gray-600 font-bold">Last Name</th>
              <th className="py-3 px-6  text-gray-600 font-bold">Email</th>
              <th className="py-3 px-6  text-gray-600 font-bold">Job Title</th>
              <th className="py-3 px-6  text-gray-600 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No candidates found.
                </td>
              </tr>
            ) : (
              candidates.map((candidate, index) => (
                candidate.interview_result === 'Selected' && (
                  <tr key={index} className="border-b hover:bg-gray-50 transition duration-200 text-center">
                    <td className="py-4 px-6">{candidate.first_name}</td>
                    <td className="py-4 px-6">{candidate.last_name}</td>
                    <td className="py-4 px-6">{candidate.email}</td>
                    <td className="py-4 px-6">{candidate.title}</td>
                    <td className="py-4 px-6">
                      <span className={`py-1 px-3 rounded-full text-sm ${getStatusStyles(candidate.status)}`}>
                        {candidate.interview_result}
                      </span>
                    </td>
                  </tr>
                )
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;

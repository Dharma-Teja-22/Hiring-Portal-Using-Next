"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useCookies } from 'next-client-cookies';


const Page = () => {
  const cookies = useCookies();
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      const manager_id = Number(cookies.get("managerId"));
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
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedCandidate && selectedDate) {
      const data = {
        job_id: selectedCandidate.job_id,
        candidate_id: selectedCandidate.candidate_id,
        interview_date: selectedDate,
      };

      try {
        await fetch("/manager/api/interview_status_update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify(data),
        });
        toast.success("Interview date assigned successfully");
        setShowModal(false);
        setSelectedCandidate(null);
        setSelectedDate(null);
      } catch (error) {
        console.error("Error assigning interview date:", error);
        toast.error("Failed to assign interview date");
      }
    } else {
      toast.error("Please select a date");
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex items-center mb-4">
        <button
          onClick={() => router.back()}
          className="text-xl text-blue-600 hover:text-blue-700 transition duration-200"
        >
          ←
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Assign Interview Dates
      </h1>

      {/* Table for displaying candidates */}
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden  text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="border-b border-gray-300 px-6 py-4  text-gray-600">
              Name
            </th>
            <th className="border-b border-gray-300 px-6 py-4  text-gray-600">
              Email
            </th>
            <th className="border-b border-gray-300 px-6 py-4  text-gray-600">
              Status
            </th>
            <th className="border-b border-gray-300 px-6 py-4  text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(
            (candidate) =>
              candidate.status === "Interview" && (
                <tr
                  key={candidate.candidate_id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="border-b border-gray-300 px-6 py-4 text-gray-800">
                    {candidate.first_name} {candidate.last_name}
                  </td>
                  <td className="border-b border-gray-300 px-6 py-4 text-gray-800">
                    {candidate.email}
                  </td>
                  <td className="border-b border-gray-300 px-6 py-4 text-gray-800">
                    {candidate.status}
                  </td>
                  <td className="border-b border-gray-300 px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setShowModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 shadow-md transform hover:scale-105"
                    >
                      Assign Interview Date
                    </button>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>

      {/* Modal for selecting date */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/3 transition-transform transform scale-95 hover:scale-100">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Assign Interview Date for {selectedCandidate?.first_name}{" "}
              {selectedCandidate?.last_name}
            </h2>
            <label className="block text-gray-700 mb-2 font-medium">
              Select Date:
            </label>
            <input
              type="date"
              value={selectedDate || ""}
              onChange={handleDateChange}
              required
              min={today} // Disable past dates
              className="border p-2 rounded w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 shadow-md mr-2"
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200 shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

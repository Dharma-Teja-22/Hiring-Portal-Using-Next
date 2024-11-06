'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCookies } from "next-client-cookies"
import { ArrowLeft } from "lucide-react"

export default function Component() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const router = useRouter()
  const cookies = useCookies()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("../../api/candidate", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setJobs(data.msg)
        setFilteredJobs(data.msg)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      }
    }
    fetchJobs()
  }, [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    filterJobs(e.target.value, statusFilter)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    filterJobs(searchQuery, e.target.value)
  }

  const filterJobs = (query, status) => {
    const lowerCaseQuery = query.toLowerCase()
    const filtered = jobs.filter((job) => {
      const matchesQuery =
        job.title.toLowerCase().includes(lowerCaseQuery) ||
        job.skills.toLowerCase().includes(lowerCaseQuery) ||
        job.location.toLowerCase().includes(lowerCaseQuery)

      const matchesStatus = status === "All" || job.status === status

      return matchesQuery && matchesStatus
    })
    setFilteredJobs(filtered)
  }

  const handleOpenApplicationForm = (job) => {
    if (job.status !== "Closed") {
      cookies.set("selectedJobTitle", job.title)
      cookies.set("selectedJobId", job.job_id.toString())
      router.push(`/candidate/applyjobs`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-blue-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg">Back</span>
        </button>

        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <input
            type="text"
            placeholder="Search by title or skills..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-200"
          />
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full md:w-auto px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-200"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No jobs found...</p>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 flex flex-col"
              >
                <div className="p-4 flex-grow">
                  <h2 className="text-xl font-bold mb-2 text-center text-cyan-900">{job.title}</h2>
                  <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-medium text-gray-900">₹ {job.salary.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">{job.location}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{job.experience_level}</span>
                    <span className="text-sm text-gray-500">{job.job_type}</span>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">Skills:</h3>
                    <p className="text-sm text-gray-600">{job.skills}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      Deadline: <span className="text-gray-600 font-normal">{job.application_deadline.split("T")[0]}</span>
                    </p>
                  </div>
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                        job.status === "Open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenApplicationForm(job)}
                  disabled={job.status === "Closed"}
                  className={`w-full py-2 font-semibold transition duration-300 ${
                    job.status === "Closed"
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Apply Now
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
"use client";

import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

const page = () => {
  const router = useRouter();
  const manager_id = Number(localStorage.getItem("managerId"));
  const [data, setData] = useState({
    title: "",
    description: "",
    salary: 0,
    location: "",
    job_type: "",
    experience_level: "",
    skills: "",
    application_deadline: new Date(),
  });


  const postJob = async () => {
    try {
      const combinedData = {
        ...data,
        manager_id,
      };

      const response = await fetch("/manager/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(combinedData),
      });

      if (response === "Date is in the past!") {
        const toastId = toast.warning(
          "Date is in the Past! Cannot post the job application!",
          {
            autoClose: 1000,
          }
        );
        setTimeout(() => {
          if (toast.isActive(toastId)) {
            router.back();
          }
        }, 1000);
      } else if (response === "Duplicate entry found") {
        const toastId = toast.warning("Duplicate post found in the database", {
          autoClose: 1000,
        });
        setTimeout(() => {
          if (toast.isActive(toastId)) {
            router.back();
          }
        }, 1000);
      } else if (response === "Successfully Job Posted") {
        toast.success("Successfully posted the job application!", {
          onClose: () => {
            router.back();
          },
        });
      }
      return response.data;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await postJob();
    console.log("API response:", response);
    setData({
      title: "",
      description: "",
      salary: 0,
      location: "",
      job_type: "",
      experience_level: "",
      skills: "",
      application_deadline: new Date(),
      status: "",
    });
  };

  return (
    <div className="bg-gray-900">
      <div className="flex items-center pt-4 ml-4">
        <button
          onClick={() => router.back()}
          className="text-xl text-blue-500 hover:text-blue-600 transition"
        >
          ← Back
        </button>
      </div>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="pt-10 pb-10">
        <Card className="mx-auto max-w-2xl shadow-md rounded-lg">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-2xl font-bold">Post A Job</CardTitle>
            <CardDescription className="mt-1">
              Enter Job Information to Post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="font-semibold">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Job Title"
                    value={data.title}
                    required
                    className="border rounded-md p-2"
                    onChange={(e) =>
                      setData({ ...data, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="salary" className="font-semibold">
                    Salary
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="e.g., 50000"
                    required
                    value={data.salary}
                    className="border rounded-md p-2"
                    onChange={(e) =>
                      setData({ ...data, salary: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="font-semibold">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Description"
                  value={data.description}
                  required
                  className="border rounded-md p-2"
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="application_deadline" className="font-semibold">
                  Application Deadline
                </Label>
                <input
                  type="date"
                  id="application_deadline"
                  value={data.application_deadline.toISOString().split("T")[0]}
                  className="border rounded-md p-2"
                  onChange={(e) => {
                    setData({
                      ...data,
                      application_deadline: new Date(e.target.value),
                    });
                  }}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location" className="font-semibold">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={data.location}
                  className="border rounded-md p-2"
                  onChange={(e) =>
                    setData({ ...data, location: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-5">
                <Label className="font-semibold">Job Type</Label>
                {["Full-time", "Part-time", "Contract"].map((type) => (
                  <Label className="flex items-center gap-2" key={type}>
                    <input
                      type="radio"
                      value={type}
                      name="job"
                      checked={data.job_type === type}
                      onChange={(e) =>
                        setData({ ...data, job_type: e.target.value })
                      }
                      required
                      className="mr-1"
                    />
                    {type}
                  </Label>
                ))}
              </div>

              <div className="flex gap-5">
                <Label className="font-semibold">Experience Level</Label>
                {["Freshers", "Experienced", "Freshers/Experienced"].map(
                  (level) => (
                    <Label className="flex items-center gap-2" key={level}>
                      <input
                        type="radio"
                        value={level}
                        name="experienceLevel"
                        checked={data.experience_level === level}
                        onChange={(e) =>
                          setData({ ...data, experience_level: e.target.value })
                        }
                        required
                        className="mr-1"
                      />
                      {level}
                    </Label>
                  )
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="skills" className="font-semibold">
                  Skills
                </Label>
                <Input
                  id="skills"
                  type="text"
                  value={data.skills}
                  className="border rounded-md p-2"
                  onChange={(e) => setData({ ...data, skills: e.target.value })}
                />
              </div>

              {/* <div className="grid gap-2">
                <Label htmlFor="status" className="font-semibold">
                  Status
                </Label>
                <Input
                  id="status"
                  type="text"
                  value={data.status}
                  className="border rounded-md p-2"
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                />
              </div> */}

              <Button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Create a Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default page;

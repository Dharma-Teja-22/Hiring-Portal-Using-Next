"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../components/ui/card'; // Ensure this component exists
import { FaClipboardList, FaUsers, FaEdit, FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

const page = () => {
  const router = useRouter();
  const [storedFirstName, setStoredFirstName] = useState('');
  const [storedLastName, setStoredLastName] = useState('');

  useEffect(() => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    
    if (firstName) setStoredFirstName(firstName);
    if (lastName) setStoredLastName(lastName);
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push('/'); 
  };

  const handleCardClick = (path) => {
    router.push(path);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white h-full p-6 flex flex-col pt-10 gap-4">
        <h2 className="text-xl font-bold mb-4">Manager Menu</h2>
        <ul className="flex flex-col gap-6 flex-grow">
          <li>
            <Link href="/manager/postjobs" className="hover:text-orange-400 transition-colors">Post Jobs</Link>
          </li>
          <li>
            <Link href="/fetch-candidates" className="hover:text-red-400 transition-colors">Fetch Candidates</Link>
          </li>
          <li>
            <Link href="/update-interview-status" className="hover:text-indigo-400 transition-colors">Update Application Status</Link>
          </li>
          <li>
            <Link href="/assign-date" className="hover:text-teal-400 transition-colors">Assign Interview Dates</Link>
          </li>
          <li>
            <Link href="/update-final-result" className="hover:text-yellow-400 transition-colors">End Result</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between bg-slate-900 text-white py-4 px-10 w-full">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 mr-3">
              <img src={`https://avatar.iran.liara.run/public/boy?username=${storedFirstName}`} alt="Profile" />
            </div>
            <span className="text-xl font-bold">
              <i>Hello {`${storedFirstName} ${storedLastName}`}</i>
            </span>
          </div>
          <button onClick={logout} className="text-red-400">Logout</button>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 items-center">
          {[
            { icon: <FaClipboardList className="text-3xl mb-4 text-orange-600" />, label: 'Post Jobs', path: '/manager/postjobs' },
            { icon: <FaUsers className="text-3xl mb-4 text-red-600" />, label: 'Fetch Candidates', path: '/fetch-candidates' },
            { icon: <FaEdit className="text-3xl mb-4 text-indigo-600" />, label: 'Update Applicant Status', path: '/update-interview-status' },
            { icon: <FaCalendarCheck className="text-3xl mb-4 text-teal-600" />, label: 'Assign Interview Dates', path: '/assign-date' },
            { icon: <FaCheckCircle className="text-3xl mb-4 text-yellow-600" />, label: 'Selected Candidates', path: '/selected-candidates' },
            { icon: <FaCheckCircle className="text-3xl mb-4 text-yellow-600" />, label: 'Update Final Result', path: '/update-final-result' },
          ].map(({ icon, label, path }, index) => (
            <Card 
              key={index}
              onClick={() => handleCardClick(path)} 
              className="p-6 flex flex-col items-center bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              {icon}
              <h1 className="text-lg font-medium text-center">{label}</h1>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

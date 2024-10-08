"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../components/ui/card'; 
import { FaBriefcase, FaFileUpload, FaTrophy } from 'react-icons/fa';
import Link from 'next/link';

const Page = () => {
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
      <div className="bg-slate-900 w-64 text-white h-full p-6 flex flex-col pt-10 gap-4">
        {/* <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 mr-3">
            <img src={`https://avatar.iran.liara.run/public/boy?username=${storedFirstName}`} alt="User Avatar" />
          </div>
          <span className="text-xl font-bold">Hello {`${storedFirstName} ${storedLastName}`}</span>
        </div> */}
        <h2 className="text-xl font-bold mb-4">Candidate Menu</h2>
        <ul className="flex flex-col flex-grow gap-6">
          <li>
            <Link href="/fetch_jobs" className="hover:text-orange-400 transition-colors">Fetch Jobs</Link>
          </li>
          <li>
            <Link href="/applyjobs" className="hover:text-purple-600 transition-colors">Application Status</Link>
          </li>
          <li>
            <Link href="/final-result" className="hover:text-yellow-400 transition-colors">End Result</Link>
          </li>
        </ul>
        {/* <button onClick={logout} className="text-red-500 hover:underline">Logout</button> */}
      </div>

      {/* Main Content Area */}
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
          <Card 
            onClick={() => handleCardClick('/fetch_jobs')} 
            className="p-6 flex flex-col items-center bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <FaBriefcase className='text-3xl mb-4 text-orange-600' />
            <h1 className='text-lg font-medium text-center'>Fetch All Jobs</h1>
          </Card>

          <Card 
            onClick={() => handleCardClick('/applyjobs')} 
            className="p-6 flex flex-col items-center bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <FaFileUpload className='text-3xl mb-4 text-purple-600' />
            <h1 className='text-lg font-medium text-center'>Applied Jobs</h1>
          </Card>

          <Card 
            onClick={() => handleCardClick('/final-result')} 
            className="p-6 flex flex-col items-center bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <FaTrophy className='text-3xl mb-4 text-yellow-600' />
            <h1 className='text-lg font-medium text-center'>Final Result / Selected Jobs</h1>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;

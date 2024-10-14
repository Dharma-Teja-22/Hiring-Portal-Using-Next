"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../components/ui/card'; // Ensure this component exists
import { FaClipboardList, FaUsers, FaEdit, FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useCookies } from 'next-client-cookies';

const page = () => {
  const router = useRouter();
  const cookies = useCookies();
  const [storedFirstName, setStoredFirstName] = useState('');
  const [storedLastName, setStoredLastName] = useState('');

  useEffect(() => {
    const firstName = cookies.get("firstName");
    const lastName  = cookies.get("lastName");
    
    // const firstName = localStorage.getItem("firstName");
    // const lastName = localStorage.getItem("lastName");
    
    setStoredFirstName(firstName);
    setStoredLastName(lastName);
  }, []);

  const logout = () => {
    const loginCookies = document.cookie.split('; ');
    loginCookies.map(loginCookie=>{
      const cookieName = loginCookie.split('=')[0];
      cookies.remove(cookieName)
    });
    router.push('/'); 
  };

  const handleCardClick = (path) => {
    router.push(path);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white h-full p-6 flex flex-col pt-10 gap-4">
        <h2 className="text-xl font-bold  text-center">Manager Menu</h2>
        <ul className="flex flex-col gap-6 flex-grow">
        <hr></hr>
          <li>
            <Link href="/manager/postjobs" className="hover:text-orange-400 transition-colors">Post Jobs</Link>
          </li>
          <li>
            <Link href="/manager/fetch_candidates" className="hover:text-red-400 transition-colors">Fetch Candidates</Link>
          </li>
          <li>
            <Link href="/manager/update_interview_status" className="hover:text-indigo-400 transition-colors">Update Application Status</Link>
          </li>
          <li>
            <Link href="/manager/assign_interview_date" className="hover:text-teal-400 transition-colors">Assign Interview Dates</Link>
          </li>
          <li>
            <Link href="/manager/selected_candidates" className="hover:text-indigo-500 transition-colors">Selected Candidates</Link>
          </li>
          <li>
            <Link href="/manager/end_result" className="hover:text-yellow-400 transition-colors">End Result</Link>
          {/* </li><hr></hr> */}</li>
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
            { icon: <FaUsers className="text-3xl mb-4 text-red-600" />, label: 'Fetch Candidates', path: '/manager/fetch_candidates' },
            { icon: <FaEdit className="text-3xl mb-4 text-indigo-600" />, label: 'Update Applicant Status', path: '/manager/update_interview_status' },
            { icon: <FaCalendarCheck className="text-3xl mb-4 text-teal-600" />, label: 'Assign Interview Dates', path: '/manager/assign_interview_date' },
            { icon: <FaCheckCircle className="text-3xl mb-4 text-yellow-600" />, label: 'Selected Candidates', path: '/manager/selected_candidates' },
            { icon: <FaCheckCircle className="text-3xl mb-4 text-yellow-600" />, label: 'Update Final Result', path: '/manager/end_result' },
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

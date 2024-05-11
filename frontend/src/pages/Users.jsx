import React, { useEffect, useState } from 'react';
import {axiosClient} from '../api/axios';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import UsersTable from '../components/users/UsersTable';

export default function Projects() {
  const [data, setData] = useState([]);
  const [filters,setFilters] = useState({})
  const [info,setInfo] = useState({})
  const baseUrl = 'http://localhost:8000/api/users'

  const fetchData = async (url) => {
    try {
      const response = await axiosClient.get(`${url}`,{
        params:filters
      });
      if (response.status === 200) {
        setData(response.data.data);
        setInfo(response.data.data)
      } 
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(baseUrl);
  }, [filters]);

  const handleNext = ()=>{
    fetchData(info.next_page_url)
  }
  const handlePrevious = ()=>{
    fetchData(info.prev_page_url)
  }
  return (
    <div className='min-h-screen bg-gray-900 '>
      <header className="bg-gray-800 shadow mb-4 rounded-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-white ">
            Users
          </h1>
            <a href='/users/create' className='font-medium text-sm bg-green-400 text-white p-2 rounded-sm mb-4'>Add User</a>
        </div>
      </header>
      {data.data  ? <UsersTable data={data} setFilters={setFilters} filters={filters} /> : <Loading />}
      <div>
        <Pagination handleNext={handleNext} handlePrevious={handlePrevious} info={info} />
      </div>
    </div>
  );
}

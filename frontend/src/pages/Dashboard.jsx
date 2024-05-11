import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardTable from '../components/DashboardTable';
import Loading from '../components/Loading';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tasksCount, setTasksCount] = useState({
    my_pending_tasks: 0,
    my_in_progress_tasks: 0,
    my_completed_tasks: 0,
    total_pending_tasks: 0,
    total_in_progress_tasks: 0,
    total_completed_tasks: 0,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL+'api/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.status === 200) {
        setData(response.data.active_tasks);
        setTasksCount({
          my_pending_tasks: response.data.my_pending_tasks,
          my_in_progress_tasks: response.data.my_in_progress_tasks,
          my_completed_tasks: response.data.my_completed_tasks,
          total_pending_tasks: response.data.total_pending_tasks,
          total_in_progress_tasks: response.data.total_in_progress_tasks,
          total_completed_tasks: response.data.total_completed_tasks,
        });
        setIsLoading(false);
      } else {
        console.error('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='min-h-screen'>
    
      <div className='flex items-center justify-between '>
        <div className='max-w-max my-5 bg-gray-800 p-4 rounded-md'>
          <h1 className='text-yellow-500 text-4xl mb-5'>Pending Tasks</h1>
          <p className='text-center text-white text-3xl'>{tasksCount.my_pending_tasks}/{tasksCount.total_pending_tasks}</p>
        </div>
        <div className='max-w-max my-5 bg-gray-800 p-4 rounded-md'>
          <h1 className='text-blue-500 text-4xl mb-5'>In Progress Tasks</h1>
          <p className='text-center text-white text-3xl'>{tasksCount.my_in_progress_tasks}/{tasksCount.total_in_progress_tasks}</p>
        </div>
        <div className='max-w-max my-5 bg-gray-800 p-4 rounded-md'>
          <h1 className='text-green-500 text-4xl mb-5'>Completed Tasks</h1>
          <p className='text-center text-white text-3xl'>{tasksCount.my_completed_tasks}/{tasksCount.total_completed_tasks}</p>
        </div>
      </div>
      <div className='bg-gray-800 text-white p-5 rounded-md'>
        {data.length > 0 ? <DashboardTable data={data} /> : <Loading/> }
      </div>
    </div>
  );
}

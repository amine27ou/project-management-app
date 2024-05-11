import React from 'react'
import Loading from '../Loading'
import { axiosClient } from '../../api/axios'
import { Link } from 'react-router-dom'

export default function TasksTable({data,setFilters,filters}) {
    
    const tasksData = data.data

    const handleFilters = (e)=>{
        setFilters(prevFilters=>({
            ...prevFilters,
            [e.target.name]:e.target.value
        }))
    }


    const handleDelete = async (id) => {
      try {
        const response = await axiosClient.delete(`${import.meta.env.VITE_BACKEND_URL}api/tasks/${id}`);
        alert(response.data.message);
      } catch (error) {
        console.error(error);
      }
      
    };
    
  return (
    <div className='bg-gray-800 text-white '>
        <table className='w-full'>
        <thead className='bg-gray-700 w-full'>
          <tr>
            <td>ID</td>
            <td> Image</td>
            <td> Project Name</td>
            <td>Task Name</td>
            <td>Status</td>
            <td>Create Date</td>
            <td>Due Date</td>
            <td>Created By</td>
            <td className='text-center'>Actions</td>
          </tr>
          <hr/>
        </thead>
          <tr className='w-full p-4'>
            <td></td>
            <td></td>
            <td><input type='text' name='name' className='text-white bg-gray-700 p-2 border rounded-md border-gray-900 outline-none' onChange={handleFilters} placeholder='Project Name' value={filters.name} /></td>
            <td><select name='status' onChange={handleFilters} className='text-white bg-gray-700 p-2 border rounded-md border-gray-900 outline-none cursor-pointer'>
                <option selected disabled >All Statuses</option>                
                <option value='pending'>Pending</option>
                <option value='in_progress'>In Progress</option>
                <option value='completed'>Completed</option>
            </select></td>
            <td></td>
            <td>    <p className='text-gray-400 underline cursor-pointer' onClick={()=>setFilters({})}>clear filters</p>
</td>
            <td></td>
          </tr>
        <tbody>
          {tasksData.length > 0 ? tasksData.map((task) => (
            <tr>
              <td>{task.id}</td>
              <td ><img src={`http://127.0.0.1:8000/storage/${task.image_path}`} className='w-10 h-10 object-cover border' /></td>
              <td className='text-gray-500'>{task.project_name}</td>
              <td><Link className='hover:underline cursor-pointer' to={`/tasks/${task.id}`}>{task.name}</Link></td>
              <td
              ><p className={ ` p-2 text-center text-sm  rounded-md  ${task.status === 'completed' ? 'bg-green-500' : task.status === 'pending' ? 'bg-yellow-500' :  'bg-blue-500'}` }>{task.status.toUpperCase() === 'IN_PROGRESS' ? 'IN PROGRESS' : task.status.toUpperCase()}</p></td>
              <td>{task.created_at.split('T')[0]}</td>
              <td>{task.due_date}</td>
              <td className='text-center'>{task.created_by}</td>
              <td className='text-center items-center justify-center flex gap-4 mt-2'>
                <button onClick={()=>{handleDelete(task.id)}} className='text-red-500' >Delete</button>
                <Link to={`/tasks/${task.id}/edit`}  className='text-blue-500' >Update</Link>
              </td>
            </tr>
          )) : <Loading/>}
        </tbody>
      </table>
    </div>
  )
}

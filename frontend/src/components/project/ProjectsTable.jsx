import React from 'react'
import Loading from '../Loading'
import { axiosClient } from '../../api/axios'
import { Link } from 'react-router-dom'

export default function ProjectsTable({data,setFilters,filters}) {
    const projectData = data.data
    const handleFilters = (e)=>{
        setFilters(prevFilters=>({
            ...prevFilters,
            [e.target.name]:e.target.value
        }))
    }


    const handleDelete = async (id) => {
      try {
        const response = await axiosClient.delete(`${import.meta.env.VITE_BACKEND_URL}api/projects/${id}`);
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
            <td> Name</td>
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
          {projectData.length > 0 ? projectData.map((project) => (
            <tr>
              <td>{project.id}</td>
              <td ><img src={`http://127.0.0.1:8000/storage/${project.image_path}`} className='w-10 h-10 object-cover border' /></td>
              <td><Link className='hover:underline cursor-pointer' to={`/projects/${project.id}`}>{project.name}</Link></td>
              <td
              ><p className={ ` p-2 text-center text-sm  rounded-md  ${project.status === 'completed' ? 'bg-green-500' : project.status === 'pending' ? 'bg-yellow-500' :  'bg-blue-500'}` }>{project.status.toUpperCase() === 'IN_PROGRESS' ? 'IN PROGRESS' : project.status.toUpperCase()}</p></td>
              <td>{project.created_at}</td>
              <td>{project.due_date}</td>
              <td className='text-center'>{project.created_by}</td>
              <td className='text-center items-center justify-center flex gap-4 mt-2'>
                <button onClick={()=>{handleDelete(project.id)}} className='text-red-500' >Delete</button>
                <Link to={`/projects/${project.id}/edit`}  className='text-blue-500' >Update</Link>
              </td>
            </tr>
          )) : <Loading/>}
        </tbody>
      </table>
    </div>
  )
}

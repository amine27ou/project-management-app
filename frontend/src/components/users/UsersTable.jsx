import React from 'react'
import Loading from '../Loading'
import { axiosClient } from '../../api/axios'
import { Link } from 'react-router-dom'

export default function UsersTable({data,setFilters,filters}) {
    const UserData = data.data
    const handleFilters = (e)=>{
        setFilters(prevFilters=>({
            ...prevFilters,
            [e.target.name]:e.target.value
        }))
    }


    const handleDelete = async (id) => {
      try {
        const response = await axiosClient.delete(`${import.meta.env.VITE_BACKEND_URL}api/users/${id}`);
        console.log(response.data.message);
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
            <td> Name</td>
            <td> Email</td>
            <td>Create Date</td>
            <td className='text-center'>Actions</td>
          </tr>
          <hr/>
        </thead>
          <tr className='w-full p-4'>
            <td></td>
            <td><input type='text' name='name' className='text-white bg-gray-700 p-2 border rounded-md border-gray-900 outline-none' onChange={handleFilters} placeholder='User name' value={filters.name} /></td>
            <td><input type='text' name='email' className='text-white bg-gray-700 p-2 border rounded-md border-gray-900 outline-none' onChange={handleFilters} placeholder='User email' value={filters.email} /></td>
            <td></td>
            <td>    <p className='text-gray-400 underline cursor-pointer' onClick={()=>setFilters({})}>clear filters</p>
</td>
            <td></td>
          </tr>
        <tbody>
          {UserData.length > 0 ? UserData.map((user) => (
            <tr>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td className='text-gray-500'>{user.email}</td>
              <td>{user.created_at.split('T')[0]}</td>
              <td className='text-center items-center justify-center flex gap-4 mt-2'>
                <button onClick={()=>{handleDelete(user.id)}} className='text-red-500' >Delete</button>
                <Link to={`/users/${user.id}/edit`}  className='text-blue-500' >Update</Link>
              </td>
            </tr>
          )) : <Loading/>}
        </tbody>
      </table>
    </div>
  )
}

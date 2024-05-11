import React from 'react'

export default function DashboardTable({data}) {

  return (
    <div>
        <table className='w-full'>
        <thead className='bg-gray-700 w-full'>
          <tr>
            <td>ID</td>
            <td>Project Name</td>
            <td>Description</td>
            <td>Status</td>
            <td>Due Date</td>
          </tr>
        </thead>
        <tbody>
          {data.map((project) => (
            <tr>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.description.slice(0,30)}...</td>
              <td
              ><p className={ ` p-2 text-center text-sm  rounded-md  ${project.status === 'completed' ? 'bg-green-500' : project.status === 'pending' ? 'bg-yellow-500' :  'bg-blue-500'}` }>{project.status.toUpperCase() === 'IN_PROGRESS' ? 'IN PROGRESS' : project.status.toUpperCase()}</p></td>
              <td>{project.due_date}</td>
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  )
}

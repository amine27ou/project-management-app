import React from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading() {
  return (
    <div className='flex items-center w-full justify-center m-4'><AiOutlineLoading3Quarters className='text-white animate-spin text-4xl ' /></div>
  )
}

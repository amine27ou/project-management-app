import React,{useEffect, useState} from 'react'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import {Link, NavLink,Outlet, useNavigate} from 'react-router-dom'
import { FaLaravel } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { useAuthContext } from '../context/AuthContext';


export default function DefaultLayout() {
  const {user,getUser,logout} = useAuthContext()
  const [isLoading,setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      getUser()
      setIsLoading(false); 
    } else if(!user){
      localStorage.removeItem('token')
      navigate('/login');
    }
  }, []);

    if(isLoading){
      return <></>
    }

  const userInfo = {
    name: user?.name,
    email: user?.email,
  }
  const navigation = [
    { name: 'Dashboard', to: '/' },
    { name: 'Projects', to: '/projects' },
    { name: 'All Tasks', to: '/tasks' },
    { name: 'Users', to: '/users' },
    { name: 'My Tasks', to: '/tasks/my-tasks' },
  ]
  const userNavigation = [
  
    { name: 'Profile', to: '/profile' },
    { name: 'Sign out', to: '/logout' },
  ]
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <>
      <div className="min-h-full bg-slate-900">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaLaravel className='text-gray-500 text-4xl' />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            
                            className={({isActive})=>classNames(
                              isActive
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm ">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <div className='flex items-center gap-3'>
                                <p className='text-gray-500 font-bold'>{userInfo.name}</p>
                                <IoChevronDown className='text-gray-500' />
                              </div>

                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item key='Profile'>
                                {({ active }) => (
                                  <Link
                                    to='/profile'
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700 w-full text-start'
                                    )}
                                  >
                                    Profile
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item key='Logout'>
                                {({ active }) => (
                                  <button
                                    onClick={logout}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700 w-full text-start'
                                    )}
                                  >
                                    Sign Out
                                  </button>
                                )}
                              </Menu.Item>
                              
                       
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      to={item.to}
                      className={({isActive})=>classNames(
                        isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}

                      >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{userInfo.name}</div>
                      <div className="text-sm font-medium leading-none text-gray-400">{userInfo.email}</div>
                    </div>
                    
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        
                        onClick={logout}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
          <hr/>
          
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Outlet/>
          </div>
        </main>
      </div>
    </>
  )
}

import { createBrowserRouter } from "react-router-dom";
import AuthProvider from '../context/AuthContext'
import GuestLayout from "../Layouts/GuestLayout";
import Login from "../components/Login";
import Register from "../components/Register";
import DefaultLayout from "../Layouts/DefaultLayout";
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Projects from '../pages/Projects';
import Tasks from '../pages/Tasks';
import MyTasks from '../pages/MyTasks';
import CreateProject from "../components/project/CreateProject";
import UpdateProject from "../components/project/UpdateProject";
import ShowProject from "../components/project/ShowProject";
import CreateTask from "../components/tasks/CreateTask";
import UpdateTask from "../components/tasks/UpdateTask";
import ShowTask from "../components/tasks/ShowTask";
import CreateUser from "../components/users/CreateUser";
import UpdateUser from "../components/users/UpdateUser";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
    {
        element: <AuthProvider> 
            <GuestLayout />,
        </AuthProvider>,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            
        ]
    },
    {
        element: <AuthProvider> 
            <DefaultLayout />,
        </AuthProvider>,
        children: [
            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: '/projects',
                element: <Projects />
            },
            {
                path: '/tasks',
                element: <Tasks />
            },
            {
                path: '/users',
                element: <Users />
            },
            {
                path: '/tasks/my-tasks',
                element: <MyTasks />
            },
            {
                path:'/projects/create',
                element: <CreateProject/>
            },
            {
                path:'/projects/:id/edit',
                element: <UpdateProject/>
            },
            {
                path:'/projects/:id/',
                element: <ShowProject/>
            },
            {
                path:'/tasks/create',
                element: <CreateTask/>
            },
            {
                path:'/tasks/:id/edit',
                element: <UpdateTask/>
            },
            {
                path:'/tasks/:id/',
                element: <ShowTask/>
            },
            {
                path:'/users/create/',
                element: <CreateUser/>
            },
            {
                path:'/users/:id/edit',
                element: <UpdateUser/>
            },
            {
                path:'/profile',
                element: <Profile/>
            },
            
        ]
    }
]);

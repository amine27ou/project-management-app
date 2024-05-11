import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function UpdateUser() {
    const { id } = useParams();
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axiosClient.patch(`${import.meta.env.VITE_BACKEND_URL}api/users/${id}`, formData);
            if (response.status === 200) {
                setError({});
                setLoading(false);
                navigate('/users');
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setLoading(false);
                setError(err.response.data.errors);
            }
        }
    };

    const fetchUser = async (id) => {
        const response = await axiosClient.get(`${import.meta.env.VITE_BACKEND_URL}api/users/${id}`);
        if (response.status === 200) {
            setUser(response.data.user);
            setFormData({
                name: response.data.user.name,
                email: response.data.user.email,
                password: '',
                password_confirmation: ''
            });
        }
    };

    useEffect(() => {
        fetchUser(id);
    }, [id]);

    return (
        <div className="min-h-screen max-w-md mx-auto mt-10 p-6 rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center text-white">Update User</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800 mt-10 p-6 rounded-md">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-500">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                        className="mt-1 block w-full px-3 py-2 border text-white bg-slate-700 rounded-md shadow-sm focus:outline-none sm:text-sm"
                    />
                    {error.name && <p className='text-red-500'>{error.name}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-500">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className="mt-1 block w-full px-3 py-2 border text-white bg-slate-700 rounded-md shadow-sm focus:outline-none "
                    />
                    {error.email && <p className='text-red-500'>{error.email}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-500">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className="mt-1 block w-full px-3 py-2 border text-white bg-slate-700 rounded-md shadow-sm focus:outline-none "
                    />
                    {error.password && <p className='text-red-500'>{error.password[0]}</p>}
                </div>
                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-500">
                        Confirm Password
                    </label>
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className="mt-1 block w-full px-3 py-2 border text-white bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {error.password_confirmation && <p className='text-red-500'>{error.password_confirmation[0]}</p>}
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? <AiOutlineLoading3Quarters className='animate-spin' /> : 'Update User'}
                    </button>
                </div>
            </form>
        </div>
    );
}

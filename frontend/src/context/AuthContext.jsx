import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../api/axios';

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [error, setError] = useState({});
  const [user, setUser] = useState({});
  const [btnLoading,setBtnLoading] = useState(false)

  const navigate = useNavigate();

  const csrf = ()=>  axiosClient.get('/sanctum/csrf-cookie');
  // get user
  const getUser = async () => {
    try {
      const response = await axiosClient.get('api/user');
      setUser(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUser(null);
        navigate('/login');
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };
  
   
//   login logic
  const login = async (formData) => {
    try {
      setBtnLoading(true)
      const response = await axiosClient.post('/login', formData);
      await csrf()
    if (response.status === 200) {
      setBtnLoading(false)
        const token = response.data.token
        localStorage.setItem('token', token);
        setError({});
        await getUser()
        navigate('/');

      }
    } catch (err) {
      if(err.response.status === 422){
        setBtnLoading(false)
        setError(err.response.data.errors)
      }
    }
  };
// register logic
  const register = async (formData) => {
    await csrf()
    try {
    const response = await axiosClient.post('/register', formData);
    if (response.status === 204) {
        setError({});
        navigate('/login');
      }
    } catch (err) {
      if(err.response.status === 422){
        setError(err.response.data.errors)
      }
    }
  };

  const logout = ()=>{
    axiosClient.post('/logout').then(()=>{
    setUser(null)
    localStorage.removeItem('token')
    navigate('/login')
})
}

  return (
    <AuthContext.Provider value={{ login, error ,user,register,logout,btnLoading,getUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);

import React, { useEffect } from 'react'
import * as jwt_decode from 'jwt-decode';
import api from '../api'
import { REFRESH_TOKEN,ACCESS_TOKEN } from '../utils/token'
import {useState, useEffect} from 'react';
import { AuthContext } from '../context/AuthContext'

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
   
  
    useEffect(() => {
      auth().catch(() => setIsAuthorized(false));
    }, []);
  
    const refreshToken = async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      try {
        const res = await api.post("/api/refresh/", { refresh: refreshToken });
        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
            login(jwt_decode(res.data.access));
          setIsAuthorized(true);
        } else {
          console.log('Failed to refresh token.');
          setIsAuthorized(false);
        }
      } catch (error) {
        console.log(error);
        logout()
        setIsAuthorized(false);
      }
    };
  
    const auth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        console.log('No access token found.');
        setIsAuthorized(false);
        return;
      }
      const decodedToken = jwt_decode(token);
      const tokenExpiration = decodedToken.exp;
      const now = Date.now() / 1000;
  
      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        login(decodedToken);
        setIsAuthorized(true);
        
      }
    };
  
    if (isAuthorized === null) {
      return <div>Loading....</div>;
    }
    return isAuthorized ? children : <Navigate to="/login" />;
  }
  
  export default ProtectedRoute;
  
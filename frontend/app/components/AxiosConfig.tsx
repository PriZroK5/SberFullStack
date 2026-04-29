'use client';
import axios from 'axios';
import { useEffect } from 'react';

export default function AxiosConfig() {
    useEffect(() => {
        axios.defaults.withCredentials = true;
        axios.defaults.xsrfCookieName = 'csrftoken';
        axios.defaults.xsrfHeaderName = 'X-CSRFToken';
        axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api'
    }, []);

    return null;
}
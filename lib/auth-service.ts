
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

export type UserRole = 'Processor' | 'Lab QA' | 'Manufacturer' | 'Admin' | 'Unassigned';
export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
}

//Updated API URL to point to localhost:5000
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
    withCredentials: true, // Enable sending cookies with requests
});

// Axios request interceptor to add JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear it
            Cookies.remove('jwt_token');
            Cookies.remove('user_data');
            // Optionally redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const AuthService = {
    register: async (user: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        companyName: string;
        phone: string | null;
        contactPerson: string | null;
        licenseNumber: string;
        gstNumber: string;
    }): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await api.post('/register', user);
            return { success: true, message: response.data.message || 'Registration successful' };
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            let errorMessage = 'Registration failed';

            if (axiosError.code === 'ERR_NETWORK') {
                errorMessage = `Cannot connect to server at ${API_URL}. Please check your connection.`;
            } else if (axiosError.code === 'ECONNABORTED') {
                errorMessage = 'Connection timed out. The server is taking too long to respond.';
            } else if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            } else if (axiosError.message) {
                errorMessage = axiosError.message;
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    },

    login: async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
        try {
            // Call real API for authentication
            const apiUrl = 'http://192.168.50.154:3000/api/auth/email/signin';
            console.log('🔵 Attempting signin with:', { email, apiUrl });

            const response = await axios.post(apiUrl,
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000
                }
            );

            console.log('✅ API Response received:', {
                status: response.status,
                data: response.data
            });

            // Check if we have a successful response
            if (response.data) {
                const token = response.data.token || response.data.accessToken || response.data.jwt;
                const user = response.data.user || response.data.data?.user;

                console.log('🔑 Token found:', !!token);
                console.log('👤 User found:', !!user);

                if (token) {
                    console.log('✅ Storing token...');
                    Cookies.set('jwt_token', token, {
                        expires: 7,
                        sameSite: 'Lax',
                        secure: process.env.NODE_ENV === 'production'
                    });
                }

                if (user) {
                    console.log('✅ Storing user data:', user);
                    Cookies.set('user_data', JSON.stringify(user), {
                        expires: 7,
                        sameSite: 'Lax'
                    });

                    // Check user status
                    if (user.status === 'PENDING') {
                        return { success: false, message: 'Account is pending approval from Admin' };
                    }
                    if (user.status === 'REJECTED') {
                        return { success: false, message: 'Account has been rejected.' };
                    }
                }

                // If we have either token or user, consider it successful
                if (token || user) {
                    console.log('✅ Login successful with API');
                    return {
                        success: true,
                        message: 'Login successful',
                        user: user || {
                            id: email,
                            email,
                            name: email.split('@')[0],
                            role: 'Admin' as UserRole,
                            status: 'APPROVED' as UserStatus,
                            createdAt: new Date().toISOString()
                        }
                    };
                }
            }

            return { success: false, message: 'Invalid response from server' };

        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            let errorMessage = 'Login failed';

            console.log('❌ API signin failed:', {
                message: axiosError.message,
                code: axiosError.code,
                response: axiosError.response?.data,
                status: axiosError.response?.status
            });

            if (axiosError.code === 'ERR_NETWORK') {
                errorMessage = `Cannot connect to server. Please check if the API server is running.`;
            } else if (axiosError.code === 'ECONNABORTED') {
                errorMessage = 'Connection timed out.';
            } else if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            } else if (axiosError.message) {
                errorMessage = axiosError.message;
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    },

    logout: () => {
        // Remove JWT token and user data from cookies
        Cookies.remove('jwt_token');
        Cookies.remove('user_data');
    },

    getCurrentUser: (): User | null => {
        const userData = Cookies.get('user_data');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch {
                return null;
            }
        }
        return null;
    },

    isAuthenticated: (): boolean => {
        return !!Cookies.get('jwt_token');
    },

    getToken: (): string | undefined => {
        return Cookies.get('jwt_token');
    },

    getPendingUsers: async (): Promise<User[]> => {
        try {
            const response = await api.get('/users?status=PENDING');
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch pending users:', error);
            return [];
        }
    },

    updateStatus: async (userId: string, status: UserStatus): Promise<boolean> => {
        try {
            await api.post(`/users/${userId}/status`, { status });
            return true;
        } catch (error) {
            console.error('Failed to update user status:', error);
            return false;
        }
    }
};

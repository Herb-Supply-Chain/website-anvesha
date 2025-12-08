
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

// Updated API URL to point to localhost:5000
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
    register: async (user: { name: string; email: string; password: string; role: UserRole }): Promise<{ success: boolean; message: string }> => {
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
            // Admin backdoor for testing if API is down or for initial setup
            if (email === 'admin@ayush.gov.in' && password === 'admin123') {
                const adminUser = {
                    id: 'admin-master',
                    name: 'System Admin',
                    email: 'admin@ayush.gov.in',
                    role: 'Admin' as UserRole,
                    status: 'APPROVED' as UserStatus,
                    createdAt: new Date().toISOString()
                };

                // Store mock token and user data
                Cookies.set('jwt_token', 'mock-admin-token', { expires: 7, sameSite: 'Lax' });
                Cookies.set('user_data', JSON.stringify(adminUser), { expires: 7, sameSite: 'Lax' });

                return {
                    success: true,
                    message: 'Login successful',
                    user: adminUser
                };
            }

            const response = await api.post('/login', { email, password });

            if (response.data.token && response.data.user) {
                // Store JWT token in cookie
                Cookies.set('jwt_token', response.data.token, {
                    expires: 7, // 7 days
                    sameSite: 'Lax',
                    secure: process.env.NODE_ENV === 'production' // Only use secure in production
                });

                // Store user data in cookie for easy access
                Cookies.set('user_data', JSON.stringify(response.data.user), {
                    expires: 7,
                    sameSite: 'Lax'
                });

                // Check status on client side if server doesn't block it
                if (response.data.user.status === 'PENDING') {
                    return { success: false, message: 'Account is pending approval from Admin' };
                }
                if (response.data.user.status === 'REJECTED') {
                    return { success: false, message: 'Account has been rejected.' };
                }

                return { success: true, message: 'Login successful', user: response.data.user };
            }
            return { success: false, message: 'Invalid response from server' };

        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            let errorMessage = 'Login failed';

            if (axiosError.code === 'ERR_NETWORK') {
                errorMessage = `Cannot connect to server at ${API_URL}. Is it running?`;
            } else if (axiosError.code === 'ECONNABORTED') {
                errorMessage = 'Connection timed out. Server is busy or unreachable.';
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

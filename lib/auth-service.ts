
import axios, { AxiosError } from 'axios';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
});

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
                return {
                    success: true,
                    message: 'Login successful',
                    user: {
                        id: 'admin-master',
                        name: 'System Admin',
                        email: 'admin@ayush.gov.in',
                        role: 'Admin',
                        status: 'APPROVED',
                        createdAt: new Date().toISOString()
                    }
                };
            }

            const response = await api.post('/login', { email, password });

            if (response.data.user) {
                // Check status on client side if server doesn't block it, 
                // though ideally server should return 403 for PENDING.
                // We'll trust the server response or check specific status fields.
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

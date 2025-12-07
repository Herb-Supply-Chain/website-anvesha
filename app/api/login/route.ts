import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Verify credentials
        const isValidPassword = mockDB.verifyPassword(email, password);
        if (!isValidPassword) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Get user
        const user = mockDB.getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check user status
        if (user.status === 'PENDING') {
            return NextResponse.json(
                { message: 'Account is pending approval from Admin' },
                { status: 403 }
            );
        }

        if (user.status === 'REJECTED') {
            return NextResponse.json(
                { message: 'Account has been rejected' },
                { status: 403 }
            );
        }

        // Successful login
        return NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

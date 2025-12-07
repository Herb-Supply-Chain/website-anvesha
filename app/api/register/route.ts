import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { UserRole } from '@/lib/auth-service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, role } = body;

        // Validation
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles: UserRole[] = ['Processor', 'Lab QA', 'Manufacturer', 'Admin', 'Unassigned'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { message: 'Invalid role' },
                { status: 400 }
            );
        }

        // Create user
        try {
            const newUser = mockDB.createUser({ name, email, password, role });

            return NextResponse.json(
                {
                    message: 'Registration successful! Your account is pending approval from Admin.',
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                        status: newUser.status
                    }
                },
                { status: 201 }
            );
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                return NextResponse.json(
                    { message: 'User with this email already exists' },
                    { status: 409 }
                );
            }
            throw error;
        }

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

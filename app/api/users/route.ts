import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { UserStatus } from '@/lib/auth-service';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status') as UserStatus | null;

        let users;
        if (status) {
            // Validate status
            const validStatuses: UserStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];
            if (!validStatuses.includes(status)) {
                return NextResponse.json(
                    { message: 'Invalid status parameter' },
                    { status: 400 }
                );
            }
            users = mockDB.getUsersByStatus(status);
        } else {
            users = mockDB.getAllUsers();
        }

        return NextResponse.json(users, { status: 200 });

    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json(
                { message: 'User ID and status are required' },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses: UserStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status value' },
                { status: 400 }
            );
        }

        const success = mockDB.updateUserStatus(id, status);

        if (!success) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'User status updated successfully', status },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update user status error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

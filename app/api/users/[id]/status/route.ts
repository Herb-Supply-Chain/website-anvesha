import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { UserStatus } from '@/lib/auth-service';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { status } = body;

        // Validation
        if (!status) {
            return NextResponse.json(
                { message: 'Status is required' },
                { status: 400 }
            );
        }

        const validStatuses: UserStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status value' },
                { status: 400 }
            );
        }

        // Update status
        const success = mockDB.updateUserStatus(id, status);

        if (!success) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'User status updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update status error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

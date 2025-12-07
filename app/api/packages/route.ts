import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const batchId = searchParams.get('batchId');

        let packages;
        if (batchId) {
            packages = mockDB.getPackagesByBatchId(batchId);
        } else {
            packages = mockDB.getAllPackages();
        }

        return NextResponse.json(packages, { status: 200 });

    } catch (error) {
        console.error('Get packages error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { batchId, size, qrCode, qrStatus, status } = body;

        if (!batchId || !size) {
            return NextResponse.json(
                { message: 'Batch ID and size are required' },
                { status: 400 }
            );
        }

        const newPackage = mockDB.createPackage({
            batchId,
            size,
            qrCode: qrCode || `QR-${Date.now()}`,
            qrStatus: qrStatus || 'generated',
            status: status || 'pending'
        });

        return NextResponse.json(
            { message: 'Package created successfully', package: newPackage },
            { status: 201 }
        );

    } catch (error) {
        console.error('Create package error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, qrStatus, status } = body;

        if (!id || !qrStatus || !status) {
            return NextResponse.json(
                { message: 'Package ID, QR status, and status are required' },
                { status: 400 }
            );
        }

        const success = mockDB.updatePackageStatus(id, qrStatus, status);

        if (!success) {
            return NextResponse.json(
                { message: 'Package not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Package updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update package error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

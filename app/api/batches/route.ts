import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { BatchStatus, ProcessingStage } from '@/lib/types/batch';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status') as BatchStatus | null;
        const stage = searchParams.get('stage') as ProcessingStage | null;

        let batches;
        if (status) {
            batches = mockDB.getBatchesByStatus(status);
        } else if (stage) {
            batches = mockDB.getBatchesByStage(stage);
        } else {
            batches = mockDB.getAllBatches();
        }

        return NextResponse.json(batches, { status: 200 });

    } catch (error) {
        console.error('Get batches error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, stage, labResults, processingStage } = body;

        if (!id) {
            return NextResponse.json(
                { message: 'Batch ID is required' },
                { status: 400 }
            );
        }

        let success = false;

        if (processingStage) {
            // Handle processing stage transition with timestamps
            success = mockDB.updateBatchProcessingStage(id, processingStage);
        } else if (labResults) {
            success = mockDB.updateBatchLabResults(id, labResults);
        } else if (status) {
            success = mockDB.updateBatchStatus(id, status, stage);
        }

        if (!success) {
            return NextResponse.json(
                { message: 'Batch not found' },
                { status: 404 }
            );
        }

        // Return updated batch
        const updatedBatch = mockDB.getBatchById(id);
        return NextResponse.json(
            { message: 'Batch updated successfully', batch: updatedBatch },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update batch error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

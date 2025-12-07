import { Batch, Package } from '@/lib/types/batch';

// Temporary stub - waiting for jspdf and qrcode packages to install
export async function generatePackagePDF(batch: Batch, packageInfo: Package): Promise<Blob> {
    console.log('PDF generation temporarily disabled - packages installing');
    return new Blob(['PDF generation temporarily disabled'], { type: 'application/pdf' });
}

export function downloadPDF(blob: Blob, filename: string) {
    console.log('PDF download temporarily disabled - packages installing');
    alert('PDF download temporarily disabled. Please wait for package installation to complete.');
}

export function formatProcessingTimeline(batch: Batch): string {
    const stages = [];

    if (batch.receivedDate) {
        stages.push(`Received: ${batch.receivedDate}`);
    }
    if (batch.dryingStartDate) {
        stages.push(`Drying: ${batch.dryingStartDate}${batch.dryingEndDate ? ` - ${batch.dryingEndDate}` : ''}`);
    }
    if (batch.grindingStartDate) {
        stages.push(`Grinding: ${batch.grindingStartDate}${batch.grindingEndDate ? ` - ${batch.grindingEndDate}` : ''}`);
    }
    if (batch.readyDate) {
        stages.push(`Ready: ${batch.readyDate}`);
    }

    return stages.join(' → ');
}

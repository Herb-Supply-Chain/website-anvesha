import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

// Static lab data sample; replace with real data or DB lookup as needed.
const sampleLabData = [
    {
        batchId: 'LAB-2025-001',
        testDate: '2025-01-10',
        moistureContent: '7.2%',
        phLevel: '6.4',
        heavyMetals: { lead: '3 ppm', arsenic: '1 ppm', cadmium: '0.1 ppm', mercury: '0.05 ppm' },
        microbial: { tbc: '8.5e3 CFU/g', yeastMold: '9.0e2 CFU/g', salmonella: 'Absent', ecoli: 'Absent' },
        remarks: 'All parameters within limits'
    },
    {
        batchId: 'LAB-2025-002',
        testDate: '2025-01-12',
        moistureContent: '6.8%',
        phLevel: '6.1',
        heavyMetals: { lead: '2 ppm', arsenic: '0.8 ppm', cadmium: '0.08 ppm', mercury: '0.04 ppm' },
        microbial: { tbc: '7.1e3 CFU/g', yeastMold: '8.0e2 CFU/g', salmonella: 'Absent', ecoli: 'Absent' },
        remarks: 'Approved'
    }
]

export async function GET() {
    const uniqueBatchId = `QR-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`

    return NextResponse.json({
        success: true,
        batchId: uniqueBatchId,
        labData: sampleLabData
    })
}







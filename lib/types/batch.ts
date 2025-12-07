// Shared types for batch data across all dashboards

export type BatchStatus = 'received' | 'drying' | 'grinding' | 'ready' | 'testing' | 'approved' | 'rejected' | 'packaged' | 'manufactured';
export type ProcessingStage = 'collection' | 'processing' | 'lab_testing' | 'packaging' | 'completed';

export interface Batch {
    id: string;
    farmId: string;
    herb: string;
    weight: number;
    status: BatchStatus;
    stage: ProcessingStage;
    processorBatchId?: string; // e.g., PROC-2024-ASH-001
    createdAt: string;
    updatedAt: string;

    // Farmer's Original Collection Data (from mobile app)
    farmerData?: {
        originalWeight: number; // Weight when collected by farmer
        collectionDate: string;
        farmerName: string;
        farmerId: string;
        yearsOfExperience?: number; // Farmer's years of experience in farming
        moistureAtCollection?: number;
        qualityGrade?: string; // A, B, C grade
        collectionNotes?: string;
        geoTaggedImages?: string[]; // URLs to images
    };

    // Processing timeline
    receivedDate?: string;
    dryingStartDate?: string;
    dryingEndDate?: string;
    grindingStartDate?: string;
    grindingEndDate?: string;
    readyDate?: string;

    // Processing Data & Variance
    processingData?: {
        receivedWeight: number; // Weight when received by processor
        weightAfterDrying?: number;
        weightAfterGrinding?: number;
        finalWeight?: number;
        moistureAfterDrying?: number;
        dryingLoss?: number; // Percentage
        grindingLoss?: number; // Percentage
        totalLoss?: number; // Percentage
        processorNotes?: string;
    };

    // Farm origin details
    farmLocation?: {
        latitude: number;
        longitude: number;
        address: string;
        district?: string;
        state?: string;
    };

    // Processor details
    processorName?: string;
    processorLicense?: string;

    // Certifications
    certifications?: {
        organic: boolean;
        ayush: boolean;
        fssai?: string;
    };

    // Lab testing data
    labTestDate?: string;
    labStatus?: 'pending' | 'in_progress' | 'completed';
    labResults?: {
        // Physical & Organoleptic
        moisture?: number;
        colorCheck?: string;
        odorCheck?: string;
        foreignMatter?: number;

        // Chemical Analysis
        purity?: number;
        contamination?: string;
        heavyMetals?: number;
        pesticides?: number;

        // Microbial Analysis
        microbialLoad?: number;
        aflatoxins?: number;

        // Overall
        approved: boolean;
        remarks?: string;
    };

    // Packaging data
    packageSize?: number;
    numberOfPackages?: number;
    qrGenerated?: boolean;

    // Manufacturing data
    manufacturingData?: {
        productName: string;
        description: string;
        benefits: string;
        usage: string;
        ingredients: string;
        manufacturerName: string;
        manufacturerLicense: string;
        manufacturingDate: string;
        expiryDate: string;
    };
}

export interface Package {
    id: string;
    batchId: string;
    size: number;
    qrCode: string;
    qrStatus: 'generated' | 'printed';
    status: 'pending' | 'applied';
    createdAt: string;
}

export interface BatchStats {
    received: number;
    drying: number;
    grinding: number;
    ready: number;
    testing: number;
    approved: number;
    packaged: number;
}

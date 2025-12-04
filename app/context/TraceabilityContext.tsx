'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define all data types
interface Collection {
    id: string;
    date: string;
    herb: string;
    quantity: string;
    location: string;
    gpsCoords: string;
    status: 'pending' | 'verified' | 'rejected';
}

interface Batch {
    id: string;
    herbName: string;
    quantity: string;
    collectionDate: string;
    batchDate: string;
    status: 'active' | 'completed' | 'processing';
    qrCode: string;
    collectionIds: string[]; // Links to collections
}

interface LabTest {
    id: string;
    batchId: string;
    herbName: string;
    testDate: string;
    soilQuality: string;
    cropQuality: string;
    pesticidesUsed: string;
    climaticCondition: string;
    result: 'Passed' | 'Failed' | 'Waiting';
    certificate: string;
}

interface ProcessingRecord {
    id: string;
    batchId: string;
    labTestId: string;
    herbName: string;
    productName: string;
    ingredients: { name: string; percentage: number }[];
    processDate: string;
    status: 'pending' | 'processing' | 'completed';
    qrCode: string;
}

interface PackageRecord {
    id: string;
    batchId: string;
    processingId: string;
    herbName: string;
    quantity: string;
    packageDate: string;
    qrCode: string;
    status: 'ready' | 'shipped' | 'delivered';
}

interface TraceabilityContextType {
    collections: Collection[];
    batches: Batch[];
    labTests: LabTest[];
    processingRecords: ProcessingRecord[];
    packages: PackageRecord[];

    addCollection: (collection: Collection) => void;
    updateCollection: (id: string, updates: Partial<Collection>) => void;

    addBatch: (batch: Batch) => void;
    updateBatch: (id: string, updates: Partial<Batch>) => void;

    addLabTest: (test: LabTest) => void;
    updateLabTest: (id: string, updates: Partial<LabTest>) => void;

    addProcessingRecord: (record: ProcessingRecord) => void;
    updateProcessingRecord: (id: string, updates: Partial<ProcessingRecord>) => void;

    addPackage: (pkg: PackageRecord) => void;
    updatePackage: (id: string, updates: Partial<PackageRecord>) => void;

    // Helper functions to get linked data
    getCollectionsForBatch: (batchId: string) => Collection[];
    getBatchesForCollection: (collectionId: string) => Batch[];
    getLabTestsForBatch: (batchId: string) => LabTest[];
    getProcessingForBatch: (batchId: string) => ProcessingRecord[];
    getPackagesForBatch: (batchId: string) => PackageRecord[];
    getCompleteTraceability: (batchId: string) => {
        collections: Collection[];
        batch: Batch | undefined;
        labTests: LabTest[];
        processing: ProcessingRecord[];
        packages: PackageRecord[];
    };
}

const TraceabilityContext = createContext<TraceabilityContextType | undefined>(undefined);

export function TraceabilityProvider({ children }: { children: ReactNode }) {
    // Initialize with sample linked data
    const [collections, setCollections] = useState<Collection[]>([
        {
            id: 'COL-001',
            date: '2024-12-04',
            herb: 'Ashwagandha',
            quantity: '50 kg',
            location: 'Rajasthan',
            gpsCoords: '26.9124°N, 75.7873°E',
            status: 'verified'
        }
    ]);

    const [batches, setBatches] = useState<Batch[]>([
        {
            id: 'BATCH-001',
            herbName: 'Ashwagandha',
            quantity: '150 kg',
            collectionDate: '2024-12-01',
            batchDate: '2024-12-04',
            status: 'completed',
            qrCode: 'QR-ASH-2024-001',
            collectionIds: ['COL-001']
        }
    ]);

    const [labTests, setLabTests] = useState<LabTest[]>([
        {
            id: 'TEST-001',
            batchId: 'BATCH-001',
            herbName: 'Ashwagandha',
            testDate: '2024-12-04',
            soilQuality: 'pH 6.5, Organic Matter 3.2%',
            cropQuality: 'Grade A, Moisture 8%',
            pesticidesUsed: 'None Detected',
            climaticCondition: 'Temperature 25°C, Humidity 60%',
            result: 'Passed',
            certificate: 'CERT-DNA-001'
        }
    ]);

    const [processingRecords, setProcessingRecords] = useState<ProcessingRecord[]>([
        {
            id: 'PROC-001',
            batchId: 'BATCH-001',
            labTestId: 'TEST-001',
            herbName: 'Ashwagandha',
            productName: 'Ashwagandha Powder',
            ingredients: [
                { name: 'Ashwagandha Root', percentage: 95 },
                { name: 'Natural Preservative', percentage: 5 }
            ],
            processDate: '2024-12-04',
            status: 'completed',
            qrCode: 'QR-PROC-ASH-001'
        }
    ]);

    const [packages, setPackages] = useState<PackageRecord[]>([
        {
            id: 'PKG-001',
            batchId: 'BATCH-001',
            processingId: 'PROC-001',
            herbName: 'Ashwagandha',
            quantity: '150 kg',
            packageDate: '2024-12-04',
            qrCode: 'QR-PKG-ASH-001',
            status: 'delivered'
        }
    ]);

    // CRUD operations
    const addCollection = (collection: Collection) => {
        setCollections([...collections, collection]);
    };

    const updateCollection = (id: string, updates: Partial<Collection>) => {
        setCollections(collections.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const addBatch = (batch: Batch) => {
        setBatches([...batches, batch]);
    };

    const updateBatch = (id: string, updates: Partial<Batch>) => {
        setBatches(batches.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const addLabTest = (test: LabTest) => {
        setLabTests([...labTests, test]);
    };

    const updateLabTest = (id: string, updates: Partial<LabTest>) => {
        setLabTests(labTests.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const addProcessingRecord = (record: ProcessingRecord) => {
        setProcessingRecords([...processingRecords, record]);
    };

    const updateProcessingRecord = (id: string, updates: Partial<ProcessingRecord>) => {
        setProcessingRecords(processingRecords.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const addPackage = (pkg: PackageRecord) => {
        setPackages([...packages, pkg]);
    };

    const updatePackage = (id: string, updates: Partial<PackageRecord>) => {
        setPackages(packages.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    // Helper functions to get linked data
    const getCollectionsForBatch = (batchId: string) => {
        const batch = batches.find(b => b.id === batchId);
        if (!batch) return [];
        return collections.filter(c => batch.collectionIds.includes(c.id));
    };

    const getBatchesForCollection = (collectionId: string) => {
        return batches.filter(b => b.collectionIds.includes(collectionId));
    };

    const getLabTestsForBatch = (batchId: string) => {
        return labTests.filter(t => t.batchId === batchId);
    };

    const getProcessingForBatch = (batchId: string) => {
        return processingRecords.filter(p => p.batchId === batchId);
    };

    const getPackagesForBatch = (batchId: string) => {
        return packages.filter(p => p.batchId === batchId);
    };

    const getCompleteTraceability = (batchId: string) => {
        const batch = batches.find(b => b.id === batchId);
        return {
            collections: getCollectionsForBatch(batchId),
            batch,
            labTests: getLabTestsForBatch(batchId),
            processing: getProcessingForBatch(batchId),
            packages: getPackagesForBatch(batchId)
        };
    };

    const value = {
        collections,
        batches,
        labTests,
        processingRecords,
        packages,
        addCollection,
        updateCollection,
        addBatch,
        updateBatch,
        addLabTest,
        updateLabTest,
        addProcessingRecord,
        updateProcessingRecord,
        addPackage,
        updatePackage,
        getCollectionsForBatch,
        getBatchesForCollection,
        getLabTestsForBatch,
        getProcessingForBatch,
        getPackagesForBatch,
        getCompleteTraceability
    };

    return (
        <TraceabilityContext.Provider value={value}>
            {children}
        </TraceabilityContext.Provider>
    );
}

export function useTraceability() {
    const context = useContext(TraceabilityContext);
    if (context === undefined) {
        throw new Error('useTraceability must be used within a TraceabilityProvider');
    }
    return context;
}

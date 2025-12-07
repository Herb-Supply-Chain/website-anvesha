import { User, UserRole, UserStatus } from './auth-service';
import { Batch, Package, BatchStatus, ProcessingStage } from './types/batch';

// Use global variables to persist data across API requests in development
// This simulates a database that persists between requests
declare global {
    var mockUsers: User[] | undefined;
    var mockBatches: Batch[] | undefined;
    var mockPackages: Package[] | undefined;
}

// Initialize data only once
if (!global.mockUsers) {
    global.mockUsers = [
        {
            id: 'admin-master',
            name: 'System Admin',
            email: 'admin@ayush.gov.in',
            role: 'Admin',
            status: 'APPROVED',
            createdAt: new Date().toISOString()
        },
        {
            id: 'user-test-1',
            name: 'John Processor',
            email: 'john@processor.com',
            role: 'Processor',
            status: 'PENDING',
            createdAt: new Date().toISOString()
        },
        {
            id: 'user-test-2',
            name: 'Sarah Lab',
            email: 'sarah@lab.com',
            role: 'Lab QA',
            status: 'PENDING',
            createdAt: new Date().toISOString()
        },
        {
            id: 'user-test-3',
            name: 'Mike Manufacturer',
            email: 'mike@manufacturer.com',
            role: 'Manufacturer',
            status: 'PENDING',
            createdAt: new Date().toISOString()
        }
    ];
}

if (!global.mockBatches) {
    global.mockBatches = [
        {
            id: 'FARM-2025-ASH-001',
            farmId: 'FARM-2025',
            herb: 'Ashwagandha',
            weight: 150,
            status: 'received',
            stage: 'processing',
            createdAt: '2025-01-28',
            updatedAt: new Date().toISOString(),
            receivedDate: '2025-01-28',
            farmLocation: {
                latitude: 23.2599,
                longitude: 77.4126,
                address: 'Village Khandwa, Tehsil Hoshangabad',
                district: 'Hoshangabad',
                state: 'Madhya Pradesh'
            },
            processorName: 'Ayurvedic Herbs Processing Unit',
            processorLicense: 'AYUSH-MP-2024-001',
            certifications: {
                organic: true,
                ayush: true,
                fssai: '12345678901234'
            },
            farmerData: {
                originalWeight: 155,
                collectionDate: '2025-01-27',
                farmerName: 'Ramesh Kumar',
                farmerId: 'FARMER-2025-001',
                yearsOfExperience: 15,
                qualityGrade: 'A',
                moistureAtCollection: 12.5
            }
        },
        {
            id: 'FARM-2025-TUL-001',
            farmId: 'FARM-2025',
            herb: 'Tulsi',
            weight: 200,
            status: 'drying',
            stage: 'processing',
            processorBatchId: 'PROC-2024-TUL-001',
            createdAt: '2025-01-20',
            updatedAt: new Date().toISOString(),
            receivedDate: '2025-01-20',
            dryingStartDate: '2025-01-21',
            farmLocation: {
                latitude: 23.2599,
                longitude: 77.4126,
                address: 'Village Khandwa, Tehsil Hoshangabad',
                district: 'Hoshangabad',
                state: 'Madhya Pradesh'
            },
            processorName: 'Ayurvedic Herbs Processing Unit',
            processorLicense: 'AYUSH-MP-2024-001',
            certifications: {
                organic: true,
                ayush: true,
                fssai: '12345678901234'
            }
        },
        {
            id: 'FARM-2026-BRA-001',
            farmId: 'FARM-2026',
            herb: 'Brahmi',
            weight: 180,
            status: 'grinding',
            stage: 'processing',
            processorBatchId: 'PROC-2024-BRA-002',
            createdAt: '2025-01-15',
            updatedAt: new Date().toISOString(),
            receivedDate: '2025-01-15',
            dryingStartDate: '2025-01-16',
            dryingEndDate: '2025-01-20',
            grindingStartDate: '2025-01-21',
            farmLocation: {
                latitude: 22.7196,
                longitude: 75.8577,
                address: 'Village Mhow, Tehsil Indore',
                district: 'Indore',
                state: 'Madhya Pradesh'
            },
            processorName: 'Ayurvedic Herbs Processing Unit',
            processorLicense: 'AYUSH-MP-2024-001',
            certifications: {
                organic: true,
                ayush: true,
                fssai: '12345678901234'
            }
        },
        {
            id: 'FARM-2024-ASH-002',
            farmId: 'FARM-2024',
            herb: 'Ashwagandha',
            weight: 150,
            status: 'ready',
            stage: 'lab_testing',
            processorBatchId: 'PROC-2025-ASH-001',
            createdAt: '2025-01-10',
            updatedAt: new Date().toISOString(),
            receivedDate: '2025-01-10',
            dryingStartDate: '2025-01-11',
            dryingEndDate: '2025-01-15',
            grindingStartDate: '2025-01-16',
            grindingEndDate: '2025-01-18',
            readyDate: '2025-01-18',
            farmLocation: {
                latitude: 23.2599,
                longitude: 77.4126,
                address: 'Village Khandwa, Tehsil Hoshangabad',
                district: 'Hoshangabad',
                state: 'Madhya Pradesh'
            },
            processorName: 'Ayurvedic Herbs Processing Unit',
            processorLicense: 'AYUSH-MP-2024-001',
            certifications: {
                organic: true,
                ayush: true,
                fssai: '12345678901234'
            }
        },
        {
            id: 'FARM-2024-TUL-002',
            farmId: 'FARM-2024',
            herb: 'Tulsi',
            weight: 150,
            status: 'ready',
            stage: 'lab_testing',
            processorBatchId: 'PROC-2025-TUL-003',
            createdAt: '2025-01-08',
            updatedAt: new Date().toISOString(),
            receivedDate: '2025-01-08',
            dryingStartDate: '2025-01-09',
            dryingEndDate: '2025-01-13',
            grindingStartDate: '2025-01-14',
            grindingEndDate: '2025-01-16',
            readyDate: '2025-01-16',
            farmLocation: {
                latitude: 22.7196,
                longitude: 75.8577,
                address: 'Village Mhow, Tehsil Indore',
                district: 'Indore',
                state: 'Madhya Pradesh'
            },
            processorName: 'Ayurvedic Herbs Processing Unit',
            processorLicense: 'AYUSH-MP-2024-001',
            certifications: {
                organic: true,
                ayush: true,
                fssai: '12345678901234'
            }
        },
        {
            id: 'FARM-2024-ASH-003',
            farmId: 'FARM-2024',
            herb: 'Ashwagandha',
            weight: 180,
            status: 'testing',
            stage: 'lab_testing',
            processorBatchId: 'PROC-2025-ASH-004',
            labStatus: 'in_progress',
            createdAt: '2025-01-05',
            updatedAt: new Date().toISOString(),
            receivedDate: '2025-01-05',
            dryingStartDate: '2025-01-06',
            dryingEndDate: '2025-01-10',
            grindingStartDate: '2025-01-11',
            grindingEndDate: '2025-01-13',
            readyDate: '2025-01-13',
            farmLocation: {
                latitude: 23.2599,
                longitude: 77.4126,
                address: 'Village Khandwa, Tehsil Hoshangabad',
                district: 'Hoshangabad',
                state: 'Madhya Pradesh'
            },
            processorName: 'Ayurvedic Herbs Processing Unit',
            processorLicense: 'AYUSH-MP-2024-001',
            certifications: {
                organic: true,
                ayush: true,
                fssai: '12345678901234'
            }
        },
        {
            id: 'FARM-2024-TUL-003',
            farmId: 'FARM-2024',
            herb: 'Tulsi',
            weight: 220,
            status: 'approved',
            stage: 'packaging',
            processorBatchId: 'PROC-2025-TUL-005',
            labStatus: 'completed',
            labTestDate: '2025-01-03',
            labResults: {
                purity: 98.5,
                moisture: 8.2,
                contamination: 'None',
                approved: true
            },
            createdAt: '2024-12-28',
            updatedAt: new Date().toISOString(),
            receivedDate: '2024-12-28',
            dryingStartDate: '2024-12-29',
            dryingEndDate: '2025-01-01',
            grindingStartDate: '2025-01-02',
            grindingEndDate: '2025-01-03',
            readyDate: '2025-01-03',
            farmLocation: {
                latitude: 22.7196,
                longitude: 75.8577,
                address: 'Village Mhow, Tehsil Indore',
                district: 'Indore',
                state: 'Madhya Pradesh'
            },
            processorName: 'Ayurvedic Herbs Processing Unit',
            processorLicense: 'AYUSH-MP-2024-001',
            certifications: {
                organic: true,
                ayush: true,
                fssai: '12345678901234'
            }
        }
    ];
}

if (!global.mockPackages) {
    global.mockPackages = [];
}

export const mockDB = {
    // Get all users
    getAllUsers: (): User[] => {
        return global.mockUsers!;
    },

    // Get users by status
    getUsersByStatus: (status: UserStatus): User[] => {
        return global.mockUsers!.filter(user => user.status === status);
    },

    // Get user by email
    getUserByEmail: (email: string): User | undefined => {
        return global.mockUsers!.find(user => user.email === email);
    },

    // Get user by ID
    getUserById: (id: string): User | undefined => {
        return global.mockUsers!.find(user => user.id === id);
    },

    // Create new user
    createUser: (userData: { name: string; email: string; password: string; role: UserRole }): User => {
        const existingUser = global.mockUsers!.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const newUser: User = {
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        global.mockUsers!.push(newUser);
        return newUser;
    },

    // Update user status
    updateUserStatus: (userId: string, status: UserStatus): boolean => {
        const userIndex = global.mockUsers!.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return false;
        }

        global.mockUsers![userIndex].status = status;
        return true;
    },

    // Verify password
    verifyPassword: (email: string, password: string): boolean => {
        if (email === 'admin@ayush.gov.in' && password === 'admin123') {
            return true;
        }
        const user = global.mockUsers!.find(u => u.email === email);
        return !!user;
    },

    // Get all batches
    getAllBatches: (): Batch[] => {
        return global.mockBatches!;
    },

    // Get batches by status
    getBatchesByStatus: (status: BatchStatus): Batch[] => {
        return global.mockBatches!.filter(batch => batch.status === status);
    },

    // Get batches by stage
    getBatchesByStage: (stage: ProcessingStage): Batch[] => {
        return global.mockBatches!.filter(batch => batch.stage === stage);
    },

    // Get batch by ID
    getBatchById: (id: string): Batch | undefined => {
        return global.mockBatches!.find(batch => batch.id === id);
    },

    // Update batch status
    updateBatchStatus: (id: string, status: BatchStatus, stage?: ProcessingStage): boolean => {
        const batchIndex = global.mockBatches!.findIndex(batch => batch.id === id);
        if (batchIndex === -1) {
            return false;
        }

        global.mockBatches![batchIndex].status = status;
        if (stage) {
            global.mockBatches![batchIndex].stage = stage;
        }
        global.mockBatches![batchIndex].updatedAt = new Date().toISOString();
        return true;
    },

    // Update batch lab results
    updateBatchLabResults: (id: string, labResults: any): boolean => {
        const batchIndex = global.mockBatches!.findIndex(batch => batch.id === id);
        if (batchIndex === -1) {
            return false;
        }

        global.mockBatches![batchIndex].labResults = labResults;
        global.mockBatches![batchIndex].labStatus = 'completed';
        global.mockBatches![batchIndex].updatedAt = new Date().toISOString();
        return true;
    },

    // Update batch processing stage
    updateBatchProcessingStage: (id: string, newStatus: BatchStatus): boolean => {
        const batchIndex = global.mockBatches!.findIndex(batch => batch.id === id);
        if (batchIndex === -1) {
            return false;
        }

        const now = new Date().toISOString().split('T')[0];
        global.mockBatches![batchIndex].status = newStatus;
        global.mockBatches![batchIndex].updatedAt = new Date().toISOString();

        switch (newStatus) {
            case 'drying':
                global.mockBatches![batchIndex].dryingStartDate = now;
                break;
            case 'grinding':
                global.mockBatches![batchIndex].dryingEndDate = now;
                global.mockBatches![batchIndex].grindingStartDate = now;
                break;
            case 'ready':
                global.mockBatches![batchIndex].grindingEndDate = now;
                global.mockBatches![batchIndex].readyDate = now;
                global.mockBatches![batchIndex].stage = 'lab_testing';
                break;
        }

        return true;
    },

    // Get all packages
    getAllPackages: (): Package[] => {
        return global.mockPackages!;
    },

    // Get packages by batch ID
    getPackagesByBatchId: (batchId: string): Package[] => {
        return global.mockPackages!.filter(pkg => pkg.batchId === batchId);
    },

    // Create package
    createPackage: (packageData: Omit<Package, 'id' | 'createdAt'>): Package => {
        const newPackage: Package = {
            ...packageData,
            id: `PKG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString()
        };

        global.mockPackages!.push(newPackage);
        return newPackage;
    },

    // Update package status
    updatePackageStatus: (id: string, qrStatus: 'generated' | 'printed', status: 'pending' | 'applied'): boolean => {
        const packageIndex = global.mockPackages!.findIndex(pkg => pkg.id === id);
        if (packageIndex === -1) {
            return false;
        }

        global.mockPackages![packageIndex].qrStatus = qrStatus;
        global.mockPackages![packageIndex].status = status;
        return true;
    }
};

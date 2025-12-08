// Enhanced Mock Data Service with Authentication
// Simulates complete backend with user registration, approval, and authentication

export interface User {
    id: string
    name: string
    email: string
    password?: string
    role: 'Farmer' | 'Processor' | 'Lab QA' | 'Manufacturer' | 'Admin'
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
    organizationName?: string
    licenseNumber?: string
    contactNumber?: string
    address?: string
    createdAt: string
    approvedAt?: string
    approvedBy?: string
}

export interface PendingRegistration {
    id: string
    firstName: string
    lastName: string
    role: 'Lab QA' | 'Processor' | 'Manufacturer'
    organizationName: string
    licenseNumber: string
    contactNumber: string
    email: string
    address: string
    submittedAt: string
}

export interface Batch {
    id: string
    herb: string
    quantity: number
    farmerId: string
    farmerName: string
    sourceFarm: string
    harvestDate: string
    qualityGrade?: string
    status: 'harvested' | 'received' | 'drying' | 'grinding' | 'testing' | 'tested' | 'packaging' | 'packaged' | 'shipped'
    labCertificateId?: string
    labTestDate?: string
    processingDate?: string
    assignedTo?: string
}

export interface LabTest {
    id: string
    batchId: string
    sampleId: string
    testDate: string
    moistureContent: string
    colorCheck: string
    odorCheck: string
    foreignMatter: string
    lead: string
    arsenic: string
    cadmium: string
    mercury: string
    pesticides: string
    aflatoxin: string
    bacterialCount: string
    yeastMold: string
    salmonella: string
    ecoli: string
    dnaBarcoding: string
    hplcAnalysis: string
    tlcFingerprinting: string
    withanolides: string
    overallGrade: string
    ayushCompliance: string
    fssaiCompliance: string
    remarks: string
    technicianName: string
    certificateId: string
}

export interface Package {
    id: string
    batchId: string
    size: string
    qrCode: string
    qrStatus: 'Printed' | 'Generated'
    status: 'Applied' | 'Pending'
    createdDate: string
}

class MockDataService {
    private users: User[] = []
    private pendingRegistrations: PendingRegistration[] = []
    private batches: Batch[] = []
    private labTests: LabTest[] = []
    private packages: Package[] = []
    private currentUser: User | null = null

    constructor() {
        this.initializeMockData()
        this.loadFromLocalStorage()
    }

    private initializeMockData() {
        // Pre-approved users with credentials
        this.users = [
            {
                id: 'USR-001',
                name: 'Admin User',
                email: 'admin@anvesha.gov.in',
                password: 'Admin@123',
                role: 'Admin',
                status: 'APPROVED',
                createdAt: '2024-01-01'
            },
            {
                id: 'USR-002',
                name: 'Dr. Amit Patel',
                email: 'amit.patel@lab.anvesha.gov.in',
                password: 'Lab@2024',
                role: 'Lab QA',
                status: 'APPROVED',
                organizationName: 'AYUSH Quality Testing Lab',
                licenseNumber: 'LAB-2024-001',
                contactNumber: '+91-9876543210',
                createdAt: '2024-01-15',
                approvedAt: '2024-01-16',
                approvedBy: 'Admin User'
            },
            {
                id: 'USR-003',
                name: 'Priya Sharma',
                email: 'priya.sharma@processor.anvesha.gov.in',
                password: 'Proc@2024',
                role: 'Processor',
                status: 'APPROVED',
                organizationName: 'Herbal Processing Unit',
                licenseNumber: 'PROC-2024-001',
                contactNumber: '+91-9876543211',
                createdAt: '2024-01-20',
                approvedAt: '2024-01-21',
                approvedBy: 'Admin User'
            }
        ]

        // Pending registrations
        this.pendingRegistrations = [
            {
                id: 'PENDING-001',
                firstName: 'Sunita',
                lastName: 'Reddy',
                role: 'Manufacturer',
                organizationName: 'Ayurvedic Medicines Pvt Ltd',
                licenseNumber: 'MFG-2024-005',
                contactNumber: '+91-9876543212',
                email: 'sunita.reddy@ayurvedic.com',
                address: '123, Industrial Area, Bangalore, Karnataka - 560001',
                submittedAt: '2025-01-28T10:30:00'
            },
            {
                id: 'PENDING-002',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                role: 'Lab QA',
                organizationName: 'Quality Assurance Lab',
                licenseNumber: 'LAB-2024-008',
                contactNumber: '+91-9876543213',
                email: 'rajesh.kumar@qalab.com',
                address: '456, Tech Park, Hyderabad, Telangana - 500032',
                submittedAt: '2025-01-27T14:15:00'
            }
        ]

        // Mock Batches
        this.batches = [
            {
                id: 'BATCH-2024-ASH-001',
                herb: 'Ashwagandha',
                quantity: 150,
                farmerId: 'FARM-001',
                farmerName: 'Rajesh Kumar',
                sourceFarm: 'FARM-2024-ASH-001',
                harvestDate: '2025-01-20',
                status: 'tested',
                qualityGrade: 'A+',
                labCertificateId: 'CERT-2024-ASH-001',
                labTestDate: '2025-01-27',
                processingDate: '2025-01-28',
                assignedTo: 'USR-002'
            },
            {
                id: 'BATCH-2024-BRH-001',
                herb: 'Brahmi',
                quantity: 180,
                farmerId: 'FARM-001',
                farmerName: 'Rajesh Kumar',
                sourceFarm: 'FARM-2024-BRH-001',
                harvestDate: '2025-01-18',
                status: 'tested',
                qualityGrade: 'A',
                labCertificateId: 'CERT-2024-BRH-001',
                labTestDate: '2025-01-26',
                processingDate: '2025-01-28',
                assignedTo: 'USR-002'
            },
            {
                id: 'BATCH-2024-TUL-001',
                herb: 'Tulsi',
                quantity: 120,
                farmerId: 'FARM-002',
                farmerName: 'Sunita Devi',
                sourceFarm: 'FARM-2024-TUL-001',
                harvestDate: '2025-01-15',
                status: 'testing',
                processingDate: '2025-01-28',
                assignedTo: 'USR-002'
            },
            {
                id: 'BATCH-2024-ASH-002',
                herb: 'Ashwagandha',
                quantity: 200,
                farmerId: 'FARM-003',
                farmerName: 'Mohan Lal',
                sourceFarm: 'FARM-2024-ASH-002',
                harvestDate: '2025-01-22',
                status: 'testing',
                processingDate: '2025-01-28',
                assignedTo: 'USR-002'
            }
        ]
    }

    private loadFromLocalStorage() {
        try {
            const savedUsers = localStorage.getItem('anvesha_users')
            const savedPending = localStorage.getItem('anvesha_pending_registrations')
            const savedBatches = localStorage.getItem('anvesha_batches')
            const savedTests = localStorage.getItem('anvesha_lab_tests')
            const savedPackages = localStorage.getItem('anvesha_packages')
            const savedCurrentUser = localStorage.getItem('anvesha_current_user')

            if (savedUsers) this.users = JSON.parse(savedUsers)
            if (savedPending) this.pendingRegistrations = JSON.parse(savedPending)
            if (savedBatches) this.batches = JSON.parse(savedBatches)
            if (savedTests) this.labTests = JSON.parse(savedTests)
            if (savedPackages) this.packages = JSON.parse(savedPackages)
            if (savedCurrentUser) this.currentUser = JSON.parse(savedCurrentUser)
        } catch (error) {
            console.log('No saved data found, using defaults')
        }
    }

    private saveToLocalStorage() {
        localStorage.setItem('anvesha_users', JSON.stringify(this.users))
        localStorage.setItem('anvesha_pending_registrations', JSON.stringify(this.pendingRegistrations))
        localStorage.setItem('anvesha_batches', JSON.stringify(this.batches))
        localStorage.setItem('anvesha_lab_tests', JSON.stringify(this.labTests))
        localStorage.setItem('anvesha_packages', JSON.stringify(this.packages))
        if (this.currentUser) {
            localStorage.setItem('anvesha_current_user', JSON.stringify(this.currentUser))
        }
    }

    private async simulateDelay(ms: number = 500) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    private generatePassword(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$'
        let password = ''
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return password
    }

    private generateEmail(firstName: string, lastName: string, role: string): string {
        const roleMap: Record<string, string> = {
            'Lab QA': 'lab',
            'Processor': 'processor',
            'Manufacturer': 'manufacturer'
        }
        return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${roleMap[role]}.anvesha.gov.in`
    }

    // Authentication APIs
    async login(email: string, password: string) {
        await this.simulateDelay()
        const user = this.users.find(u => u.email === email && u.password === password)

        if (!user) {
            return { success: false, message: 'Invalid email or password' }
        }

        if (user.status === 'PENDING') {
            return { success: false, message: 'Your registration is pending approval' }
        }

        if (user.status === 'REJECTED') {
            return { success: false, message: 'Your registration has been rejected' }
        }

        this.currentUser = user
        this.saveToLocalStorage()
        return { success: true, data: user }
    }

    async logout() {
        this.currentUser = null
        localStorage.removeItem('anvesha_current_user')
        return { success: true }
    }

    getCurrentUser() {
        return this.currentUser
    }

    // Registration APIs
    async submitRegistration(registration: Omit<PendingRegistration, 'id' | 'submittedAt'>) {
        await this.simulateDelay()
        const newRegistration: PendingRegistration = {
            ...registration,
            id: `PENDING-${Date.now()}`,
            submittedAt: new Date().toISOString()
        }
        this.pendingRegistrations.push(newRegistration)
        this.saveToLocalStorage()
        return { success: true, data: newRegistration }
    }

    async getPendingRegistrations() {
        await this.simulateDelay()
        return { success: true, data: this.pendingRegistrations }
    }

    async approveRegistration(registrationId: string) {
        await this.simulateDelay()
        const registration = this.pendingRegistrations.find(r => r.id === registrationId)

        if (!registration) {
            return { success: false, message: 'Registration not found' }
        }

        // Generate credentials
        const email = this.generateEmail(registration.firstName, registration.lastName, registration.role)
        const password = this.generatePassword()

        // Create approved user
        const newUser: User = {
            id: `USR-${Date.now()}`,
            name: `${registration.firstName} ${registration.lastName}`,
            email,
            password,
            role: registration.role,
            status: 'APPROVED',
            organizationName: registration.organizationName,
            licenseNumber: registration.licenseNumber,
            contactNumber: registration.contactNumber,
            address: registration.address,
            createdAt: registration.submittedAt,
            approvedAt: new Date().toISOString(),
            approvedBy: this.currentUser?.name || 'Admin'
        }

        this.users.push(newUser)
        this.pendingRegistrations = this.pendingRegistrations.filter(r => r.id !== registrationId)
        this.saveToLocalStorage()

        return {
            success: true,
            data: {
                user: newUser,
                credentials: { email, password }
            }
        }
    }

    async rejectRegistration(registrationId: string) {
        await this.simulateDelay()
        this.pendingRegistrations = this.pendingRegistrations.filter(r => r.id !== registrationId)
        this.saveToLocalStorage()
        return { success: true }
    }

    // User APIs
    async getUsers() {
        await this.simulateDelay()
        return { success: true, data: this.users }
    }

    async getUsersByRole(role: string) {
        await this.simulateDelay()
        const filteredUsers = this.users.filter(u => u.role === role && u.status === 'APPROVED')
        return { success: true, data: filteredUsers }
    }

    // Batch APIs
    async getBatches(status?: string, assignedTo?: string) {
        await this.simulateDelay()
        let filteredBatches = this.batches
        if (status) {
            filteredBatches = filteredBatches.filter(b => b.status === status)
        }
        if (assignedTo) {
            filteredBatches = filteredBatches.filter(b => b.assignedTo === assignedTo)
        }
        return { success: true, data: filteredBatches }
    }

    async updateBatch(id: string, updates: Partial<Batch>) {
        await this.simulateDelay()
        const index = this.batches.findIndex(b => b.id === id)
        if (index !== -1) {
            this.batches[index] = { ...this.batches[index], ...updates }
            this.saveToLocalStorage()
            return { success: true, data: this.batches[index] }
        }
        return { success: false, message: 'Batch not found' }
    }

    // Lab Test APIs
    async saveLabTest(test: LabTest) {
        await this.simulateDelay()
        const existingIndex = this.labTests.findIndex(t => t.batchId === test.batchId)

        if (existingIndex !== -1) {
            this.labTests[existingIndex] = test
        } else {
            this.labTests.push(test)
        }

        // Update batch status
        await this.updateBatch(test.batchId, {
            status: 'tested',
            qualityGrade: test.overallGrade,
            labCertificateId: test.certificateId,
            labTestDate: test.testDate
        })

        this.saveToLocalStorage()
        return { success: true, data: test }
    }

    // Package APIs
    async createPackages(batchId: string, count: number, size: string) {
        await this.simulateDelay()
        const newPackages: Package[] = []

        for (let i = 1; i <= count; i++) {
            newPackages.push({
                id: `${batchId}-PKG-${i.toString().padStart(2, '0')}`,
                batchId,
                size: `${size}kg`,
                qrCode: `QR-${batchId}-${i}`,
                qrStatus: 'Generated',
                status: 'Pending',
                createdDate: new Date().toISOString()
            })
        }

        this.packages = [...this.packages.filter(p => p.batchId !== batchId), ...newPackages]
        await this.updateBatch(batchId, { status: 'packaging' })

        this.saveToLocalStorage()
        return { success: true, data: newPackages }
    }

    async getPackages(batchId?: string) {
        await this.simulateDelay()
        let filteredPackages = this.packages
        if (batchId) {
            filteredPackages = this.packages.filter(p => p.batchId === batchId)
        }
        return { success: true, data: filteredPackages }
    }

    async updatePackage(id: string, updates: Partial<Package>) {
        await this.simulateDelay()
        const index = this.packages.findIndex(p => p.id === id)
        if (index !== -1) {
            this.packages[index] = { ...this.packages[index], ...updates }
            this.saveToLocalStorage()
            return { success: true, data: this.packages[index] }
        }
        return { success: false, message: 'Package not found' }
    }
}

// Export singleton instance
export const mockDataService = new MockDataService()

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Google Maps type declarations
declare global {
    interface Window {
        google: any
    }
}

interface PendingRegistration {
    id: string
    type: 'Laboratory' | 'Processor' | 'Manufacturer'
    name: string
    contact: string
    email: string
    phone: string
    submittedDate: string
    nablNumber?: string
    licenseNumber?: string
    fssaiNumber?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    // Store full original data
    originalData?: any
}

export default function AdminPage() {
    const API_BASE = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || ''
    const [activeSection, setActiveSection] = useState('approve-registrations')
    const [showApprovals, setShowApprovals] = useState(true)
    const [selectedRegistration, setSelectedRegistration] = useState<PendingRegistration | null>(null)
    const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [originalRequests, setOriginalRequests] = useState<any[]>([])
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userEmail, setUserEmail] = useState<string>('')
    const [geoFencingData, setGeoFencingData] = useState({
        name: '',
        minLatitude: '',
        maxLatitude: '',
        minLongitude: '',
        maxLongitude: ''
    })
    const [geoFencingErrors, setGeoFencingErrors] = useState({
        name: '',
        minLatitude: '',
        maxLatitude: '',
        minLongitude: '',
        maxLongitude: ''
    })
    const [isSubmittingGeoFencing, setIsSubmittingGeoFencing] = useState(false)
    const [geoFencingSuccess, setGeoFencingSuccess] = useState(false)
    const [geoFencingError, setGeoFencingError] = useState('')
    const [showMap, setShowMap] = useState(true)
    const [mapsApiLoaded, setMapsApiLoaded] = useState(false)
    const [mapLoading, setMapLoading] = useState(false)
    const [mapUpdateTrigger, setMapUpdateTrigger] = useState(0)
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const rectangleRef = useRef<any>(null)
    const approvedRectanglesRef = useRef<any[]>([])
    const [approvedZones, setApprovedZones] = useState<any[]>([])

    const fetchApprovedZones = async () => {
        try {
            const token = getToken()
            const headers: HeadersInit = { 'Content-Type': 'application/json' }
            if (token) headers['Authorization'] = `Bearer ${token}`
            const res = await fetch(`${API_BASE}/api/geofencing/zones/approved`, { headers })
            if (!res.ok) throw new Error('Failed to load approved zones')
            const data = await res.json()
            const zones = data?.data || data?.zones || []
            setApprovedZones(zones)
            setMapUpdateTrigger(prev => prev + 1)
        } catch (err) {
            console.warn('Could not load approved zones', err)
        }
    }

    useEffect(() => {
        if (activeSection === 'geo-fencing') {
            fetchApprovedZones()
        }
    }, [activeSection])

    // Helper function to get token from cookies or localStorage
    const getToken = () => {
        if (typeof document === 'undefined') return null
        
        // Try cookies first
        const cookies = document.cookie.split(';')
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=')
            if (name === 'jwt_token') {
                const decoded = decodeURIComponent(value)
                if (decoded) return decoded
            }
        }
        
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('jwt_token')
            if (token) return token
        }
        
        return null
    }

    // Helper function to decode JWT and get user email
    const getUserEmailFromToken = () => {
        try {
            const token = getToken()
            if (!token) return null

            // JWT tokens have 3 parts separated by dots
            const parts = token.split('.')
            if (parts.length !== 3) return null

            // Decode the payload (second part)
            const payload = parts[1]
            // Add padding if needed
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
            const decodedPayload = JSON.parse(atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/')))
            
            // Try to get email from various possible fields
            return decodedPayload.email || decodedPayload.user?.email || decodedPayload.userEmail || null
        } catch (error) {
            console.error('Error decoding token:', error)
            return null
        }
    }

    // Load Google Maps API (only once)
    useEffect(() => {
        if (typeof window === 'undefined') return
        
        // Check if already loaded
        if ((window as any).google && (window as any).google.maps) {
            setMapsApiLoaded(true)
            return
        }
        
        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
        if (existingScript) {
            // Wait for existing script to load
            let attempts = 0
            const maxAttempts = 50 // 5 seconds max
            const checkGoogle = setInterval(() => {
                attempts++
                if ((window as any).google && (window as any).google.maps) {
                    clearInterval(checkGoogle)
                    setMapsApiLoaded(true)
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkGoogle)
                    console.error('Google Maps API loading timeout')
                }
            }, 100)
            return () => clearInterval(checkGoogle)
        }
        
        // Load the script
        const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao'
        
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=drawing`
        script.async = true
        script.defer = true
        script.id = 'google-maps-script'
        
        script.onload = () => {
            setMapsApiLoaded(true)
            console.log('Google Maps API loaded successfully')
        }
        
        script.onerror = () => {
            console.error('Failed to load Google Maps API. Please check your API key.')
            setMapsApiLoaded(false)
        }
        
        document.head.appendChild(script)
    }, [])

    // Update map dynamically when coordinates change (with debounce)
    useEffect(() => {
        if (!mapRef.current || !mapsApiLoaded) return
        
        const google = (window as any).google
        if (!google || !google.maps) return
        
        const hasAllCoords = geoFencingData.minLatitude && geoFencingData.maxLatitude && geoFencingData.minLongitude && geoFencingData.maxLongitude
        const minLat = hasAllCoords ? parseFloat(geoFencingData.minLatitude) : null
        const maxLat = hasAllCoords ? parseFloat(geoFencingData.maxLatitude) : null
        const minLng = hasAllCoords ? parseFloat(geoFencingData.minLongitude) : null
        const maxLng = hasAllCoords ? parseFloat(geoFencingData.maxLongitude) : null
        const coordsValid = hasAllCoords &&
            !isNaN(minLat!) && !isNaN(maxLat!) && !isNaN(minLng!) && !isNaN(maxLng!) &&
            minLat! < maxLat! && minLng! < maxLng! &&
            minLat! >= -90 && maxLat! <= 90 && minLng! >= -180 && maxLng! <= 180
        
        // Debounce map updates to avoid too many re-renders
        const timeoutId = setTimeout(() => {
            setMapLoading(true)
            
            try {
                const centerLat = coordsValid ? (minLat! + maxLat!) / 2 : 20.5937 // India centroid fallback
                const centerLng = coordsValid ? (minLng! + maxLng!) / 2 : 78.9629
                
                // Initialize or update map
                if (!mapInstanceRef.current) {
                    mapInstanceRef.current = new google.maps.Map(mapRef.current!, {
                        center: { lat: centerLat, lng: centerLng },
                        zoom: 8,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        styles: [
                            { elementType: 'geometry', stylers: [{ color: '#f1f5f9' }] },
                            { elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
                            { elementType: 'labels.text.stroke', stylers: [{ color: '#f8fafc' }] },
                            { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
                            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                            { featureType: 'road', stylers: [{ color: '#cbd5e1' }] },
                            { featureType: 'road.arterial', stylers: [{ color: '#cbd5e1' }] },
                            { featureType: 'road.highway', stylers: [{ color: '#94a3b8' }] },
                            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
                            { featureType: 'water', stylers: [{ color: '#e0f2fe' }] }
                        ],
                        zoomControl: true,
                        streetViewControl: false,
                        fullscreenControl: true,
                        gestureHandling: 'greedy', // allow direct scroll zoom without Ctrl
                        scrollwheel: true
                    })
                } else {
                    // Update map center if it already exists
                    mapInstanceRef.current.setCenter({ lat: centerLat, lng: centerLng })
                }
                
                // Clear previous rectangles
                if (rectangleRef.current) {
                    rectangleRef.current.setMap(null)
                    rectangleRef.current = null
                }
                approvedRectanglesRef.current.forEach(r => r.setMap(null))
                approvedRectanglesRef.current = []

                // Draw current input rectangle if valid
                if (coordsValid) {
                    rectangleRef.current = new google.maps.Rectangle({
                        bounds: {
                            north: maxLat!,
                            south: minLat!,
                            east: maxLng!,
                            west: minLng!
                        },
                        editable: false,
                        draggable: false,
                        fillColor: '#0f766e',
                        fillOpacity: 0.2,
                        strokeColor: '#0ea5e9',
                        strokeOpacity: 0.9,
                        strokeWeight: 3,
                        strokePosition: google.maps.StrokePosition.CENTER
                    })
                    
                    rectangleRef.current.setMap(mapInstanceRef.current)
                    
                    // Fit map to bounds with padding
                    const bounds = new google.maps.LatLngBounds(
                        new google.maps.LatLng(minLat!, minLng!),
                        new google.maps.LatLng(maxLat!, maxLng!)
                    )
                    mapInstanceRef.current.fitBounds(bounds, { padding: 50 })
                }

                // Draw approved zones
                approvedZones.forEach(zone => {
                    if (
                        zone.minLatitude !== undefined &&
                        zone.maxLatitude !== undefined &&
                        zone.minLongitude !== undefined &&
                        zone.maxLongitude !== undefined
                    ) {
                        const rect = new google.maps.Rectangle({
                            bounds: {
                                north: zone.maxLatitude,
                                south: zone.minLatitude,
                                east: zone.maxLongitude,
                                west: zone.minLongitude
                            },
                            editable: false,
                            draggable: false,
                            fillColor: '#0f172a',
                            fillOpacity: 0.08,
                            strokeColor: '#1d4ed8',
                            strokeOpacity: 0.9,
                            strokeWeight: 2,
                            strokePosition: google.maps.StrokePosition.CENTER
                        })
                        rect.setMap(mapInstanceRef.current)
                        approvedRectanglesRef.current.push(rect)
                    }
                })
                
                // Use setTimeout to ensure map renders before hiding loading
                setTimeout(() => {
                    setMapLoading(false)
                }, 300)
            } catch (error) {
                console.error('Error updating map:', error)
                setMapLoading(false)
            }
        }, 500) // 500ms debounce
        
        return () => {
            clearTimeout(timeoutId)
        }
    }, [showMap, mapsApiLoaded, geoFencingData.minLatitude, geoFencingData.maxLatitude, geoFencingData.minLongitude, geoFencingData.maxLongitude, mapUpdateTrigger])

    // Fetch user email on component mount
    useEffect(() => {
        const email = getUserEmailFromToken()
        if (email) {
            setUserEmail(email)
        } else {
            // If email not in token, try to fetch from API
            const fetchUserInfo = async () => {
                try {
                    const token = getToken()
                    if (!token) return

                    const response = await fetch(`${API_BASE}/api/auth/me`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })

                    if (response.ok) {
                        const data = await response.json()
                        const email = data.email || data.user?.email || data.data?.email
                        if (email) {
                            setUserEmail(email)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error)
                }
            }
            fetchUserInfo()
        }
    }, [])

    // Fetch pending registrations from API
    const fetchPendingRegistrations = async () => {
        setIsLoading(true)
        setError('')
        try {
            const token = getToken()
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            }
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE}/api/approval/requests`, {
                method: 'GET',
                headers,
            })

            const data = await response.json()
            console.log('API Response:', data)

            if (response.ok && data && data.success) {
                // Extract requests from data.data.requests
                const requests = data.data?.requests || []
                
                // Save original requests data
                setOriginalRequests(requests)
                
                if (Array.isArray(requests) && requests.length > 0) {
                    setPendingRegistrations(requests.map((item: any) => ({
                        id: item.id || item._id || Date.now().toString(),
                        type: item.role === 'MANUFACTURER' ? 'Manufacturer' : 
                              item.role === 'LAB QA' ? 'Laboratory' : 
                              item.role === 'PROCESSOR' ? 'Processor' : 'Processor',
                        name: item.companyName || item.name || '',
                        contact: item.contactPerson || item.contact || '',
                        email: item.email || '',
                        phone: item.phone || '',
                        submittedDate: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        nablNumber: item.nablNumber,
                        licenseNumber: item.licenseNumber || '',
                        fssaiNumber: item.fssaiNumber,
                        address: item.address,
                        city: item.city,
                        state: item.state,
                        pincode: item.pincode,
                        originalData: item, // Store full original data
                    })))
                } else {
                    // No pending registrations
                    setPendingRegistrations([])
                }
            } else {
                setError(data?.message || 'Failed to load pending registrations')
                setPendingRegistrations([])
            }
        } catch (err) {
            console.error('Error fetching registrations:', err)
            setError('Unable to connect to server')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (activeSection === 'approve-registrations') {
            fetchPendingRegistrations()
        }
    }, [activeSection])

    const handleApprove = async (id: string) => {
        const registration = pendingRegistrations.find(r => r.id === id)
        if (!registration) {
            alert('Registration not found')
            return
        }

        const token = getToken()
        if (!token) {
            alert('Please login to approve registrations')
            return
        }

        setProcessingId(id)
        try {
            console.log('Sending approve request:', { id, token: token ? 'Token present' : 'No token' })
            
            const response = await fetch(`${API_BASE}/api/approval/requests/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    status: 'APPROVED',
                }),
            })

            const data = await response.json()
            console.log('Approve response:', data)

            if (response.ok && data.success) {
                alert(`✅ Approved!\n\nRegistration has been approved successfully.`)
                
                // Refresh the list from API
                await fetchPendingRegistrations()
                setSelectedRegistration(null)
            } else {
                alert(data?.message || 'Failed to approve registration')
            }
        } catch (err) {
            console.error('Error approving registration:', err)
            alert('Unable to connect to server. Please try again.')
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (id: string) => {
        const registration = pendingRegistrations.find(r => r.id === id)
        if (!registration) {
            alert('Registration not found')
            return
        }

        const reason = prompt('Please provide a reason for rejection (optional):')
        if (reason === null) {
            return // User cancelled
        }

        const token = getToken()
        if (!token) {
            alert('Please login to reject registrations')
            return
        }

        setProcessingId(id)
        try {
            console.log('Sending reject request:', { id, token: token ? 'Token present' : 'No token' })
            
            const response = await fetch(`${API_BASE}/api/approval/requests/reject`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    status: 'REJECTED',
                    rejectedReason: reason || '',
                }),
            })

            const data = await response.json()
            console.log('Reject response:', data)

            if (response.ok && data.success) {
                alert('Registration rejected successfully.')
                
                // Refresh the list from API
                await fetchPendingRegistrations()
                setSelectedRegistration(null)
            } else {
                alert(data?.message || 'Failed to reject registration')
            }
        } catch (err) {
            console.error('Error rejecting registration:', err)
            alert('Unable to connect to server. Please try again.')
        } finally {
            setProcessingId(null)
        }
    }


    const sidebarItems = [
        {
            id: 'approve-registrations',
            label: 'Approve Registrations',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'farmer-data',
            label: 'Farmer Data',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            id: 'lab-mgmt',
            label: 'Lab Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            id: 'processor-mgmt',
            label: 'Processor Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            id: 'manufacturer-mgmt',
            label: 'Manufacturer',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            id: 'geo-fencing',
            label: 'Geo Fencing',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        }
    ]

    return (
        <div className="min-h-screen bg-white flex font-inter">
            {/* Mobile Menu Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-[#014848] text-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg p-1.5 flex items-center justify-center">
                            <Link href="/" aria-label="Go to home" className="block w-full h-full">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </Link>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">ANVESHA</h1>
                            <p className="text-[10px] text-teal-100 uppercase tracking-wider">Admin Console</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveSection(item.id)
                                if (item.id === 'approve-registrations') {
                                    setShowApprovals(true)
                                }
                                setSidebarOpen(false) // Close sidebar on mobile when item is clicked
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id
                                ? 'bg-white text-[#014848]'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 bg-[#003838]">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-9 h-9 rounded-full bg-teal-800 flex items-center justify-center text-xs font-bold">
                            {userEmail ? userEmail.charAt(0).toUpperCase() : 'AD'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Administrator</p>
                            <p className="text-xs text-teal-200 truncate" title={userEmail || 'admin@ayush.gov.in'}>
                                {userEmail || 'admin@ayush.gov.in'}
                            </p>
                        </div>
                    </div>
                    <Link href="/" className="flex items-center justify-center gap-2 w-full py-2 text-xs bg-white/10 hover:bg-red-500/80 rounded-md transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 bg-gray-50">
                {/* Mobile Header */}
                <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg bg-[#014848] text-white hover:bg-[#013636] transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">ANVESHA Admin</h2>
                    <div className="w-10"></div>
                </div>

                <header className="mb-4 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <div className="p-3 bg-teal-50 rounded-lg text-[#014848]">
                            {sidebarItems.find(i => i.id === activeSection)?.icon}
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                {sidebarItems.find(i => i.id === activeSection)?.label}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage system operations</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-lg border border-gray-200 min-h-[600px] p-4 sm:p-6 lg:p-8">
                    {/* Approve Registrations Section */}
                    {activeSection === 'approve-registrations' && (
                        <div>
                            {showApprovals ? (
                                <div className="max-w-6xl mx-auto">
                                    <div className="mb-4 sm:mb-8">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Pending Approvals</h3>
                                        <p className="text-sm sm:text-base text-gray-600 mt-1">Review and approve new facility registrations</p>
                                    </div>

                                    {isLoading ? (
                                        <div className="text-center py-12">
                                            <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <p className="text-gray-600 font-medium">Loading pending registrations...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                                            <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-red-700 font-semibold mb-2">{error}</p>
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    ) : pendingRegistrations.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-gray-500 text-lg font-semibold">No pending registrations</p>
                                            <p className="text-gray-400 text-sm mt-2">All registrations have been processed</p>
                                        </div>
                                    ) : selectedRegistration ? (
                                        // Detailed View
                                        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                                            <div className="bg-gradient-to-r from-[#016868] to-[#014d4d] p-6 text-white">
                                                <button
                                                    onClick={() => setSelectedRegistration(null)}
                                                    className="flex items-center gap-2 text-white/80 hover:text-white font-medium mb-4"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                    Back to List
                                                </button>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full">
                                                        {selectedRegistration.type}
                                                    </span>
                                                    <span className="text-sm text-white/80">
                                                        Submitted: {selectedRegistration.submittedDate}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{selectedRegistration.name}</h3>
                                            </div>

                                            <div className="p-4 sm:p-6 lg:p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-lg font-bold text-gray-900 border-b-2 border-[#016868] pb-2">Contact Information</h4>
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-semibold">Contact Person</p>
                                                            <p className="text-gray-900 font-bold">{selectedRegistration.contact}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-semibold">Email Address</p>
                                                            <p className="text-gray-900 font-bold">{selectedRegistration.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-semibold">Phone Number</p>
                                                            <p className="text-gray-900 font-bold">{selectedRegistration.phone}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-lg font-bold text-gray-900 border-b-2 border-[#016868] pb-2">Facility Details</h4>
                                                        {selectedRegistration.nablNumber && (
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-semibold">NABL Accreditation Number</p>
                                                                <p className="text-gray-900 font-bold">{selectedRegistration.nablNumber}</p>
                                                            </div>
                                                        )}
                                                        {selectedRegistration.licenseNumber && (
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-semibold">License Number</p>
                                                                <p className="text-gray-900 font-bold">{selectedRegistration.licenseNumber}</p>
                                                            </div>
                                                        )}
                                                        {selectedRegistration.fssaiNumber && (
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-semibold">FSSAI Number</p>
                                                                <p className="text-gray-900 font-bold">{selectedRegistration.fssaiNumber}</p>
                                                            </div>
                                                        )}
                                                        {selectedRegistration.address && (
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-semibold">Address</p>
                                                                <p className="text-gray-900 font-bold">
                                                                    {selectedRegistration.address}<br />
                                                                    {selectedRegistration.city}, {selectedRegistration.state} - {selectedRegistration.pincode}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-200">
                                                    <button
                                                        onClick={() => handleApprove(selectedRegistration.id)}
                                                        disabled={processingId === selectedRegistration.id}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                                    >
                                                        {processingId === selectedRegistration.id ? (
                                                            <>
                                                                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                <span>Processing...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Approve & Generate Credentials
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(selectedRegistration.id)}
                                                        disabled={processingId === selectedRegistration.id}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                                    >
                                                        {processingId === selectedRegistration.id ? (
                                                            <>
                                                                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                <span>Processing...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Reject Application
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // List View
                                        <div className="space-y-3 sm:space-y-4">
                                            {pendingRegistrations.map((registration) => (
                                                <div key={registration.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-[#016868] hover:shadow-md transition-all">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                                                <span className="px-2 sm:px-3 py-1 bg-[#016868]/10 text-[#016868] text-xs font-bold rounded-full border-2 border-[#016868]/30">
                                                                    {registration.type}
                                                                </span>
                                                                <span className="text-xs text-gray-500 font-semibold">
                                                                    Submitted: {registration.submittedDate}
                                                                </span>
                                                            </div>

                                                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{registration.name}</h4>

                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-gray-500 font-semibold text-xs sm:text-sm">Contact Person</p>
                                                                    <p className="font-bold text-gray-900 text-sm sm:text-base">{registration.contact}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500 font-semibold text-xs sm:text-sm">Email</p>
                                                                    <p className="font-bold text-gray-900 text-sm sm:text-base break-all">{registration.email}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500 font-semibold text-xs sm:text-sm">Phone</p>
                                                                    <p className="font-bold text-gray-900 text-sm sm:text-base">{registration.phone}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col sm:flex-col gap-2 sm:ml-6 w-full sm:w-auto">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedRegistration(registration)
                                                                    setSidebarOpen(false)
                                                                }}
                                                                className="flex items-center justify-center gap-2 bg-[#016868] hover:bg-[#014d4d] text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                                                            >
                                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                View Details
                                                            </button>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleApprove(registration.id)}
                                                                    disabled={processingId === registration.id}
                                                                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    title="Approve"
                                                                >
                                                                    {processingId === registration.id ? (
                                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(registration.id)}
                                                                    disabled={processingId === registration.id}
                                                                    className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    title="Reject"
                                                                >
                                                                    {processingId === registration.id ? (
                                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    )}

                    {/* Farmer Data Section */}
                    {activeSection === 'farmer-data' && (
                        <div className="space-y-6">
                            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
                                <div className="flex items-center gap-3">
                                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Farmer Mobile App Data</h3>
                                        <p className="text-sm text-gray-600">Data submitted by farmers through the mobile application</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Total Farmers</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Active Batches</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">89</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Total Herbs Supplied</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">12,450 kg</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">This Month</p>
                                    <p className="text-2xl font-bold text-purple-600 mt-1">2,340 kg</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900">Recent Farmer Submissions</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Farmer Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Herb Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {[
                                                { name: 'Ramesh Kumar', location: 'Uttarakhand', herb: 'Ashwagandha', qty: '150 kg', date: '2025-12-07', status: 'Sent to Lab' },
                                                { name: 'Priya Devi', location: 'Himachal Pradesh', herb: 'Brahmi', qty: '80 kg', date: '2025-12-07', status: 'In Testing' },
                                                { name: 'Suresh Patel', location: 'Gujarat', herb: 'Tulsi', qty: '200 kg', date: '2025-12-06', status: 'Approved' },
                                                { name: 'Lakshmi Reddy', location: 'Karnataka', herb: 'Neem', qty: '120 kg', date: '2025-12-06', status: 'Sent to Lab' },
                                                { name: 'Vijay Singh', location: 'Rajasthan', herb: 'Giloy', qty: '95 kg', date: '2025-12-05', status: 'Approved' }
                                            ].map((farmer, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{farmer.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{farmer.location}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{farmer.herb}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{farmer.qty}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{farmer.date}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${farmer.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            farmer.status === 'In Testing' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {farmer.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lab Management Section */}
                    {activeSection === 'lab-mgmt' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Total Batches Received</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">24</p>
                                    <p className="text-xs text-gray-500 mt-1">From farmers via app</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Tests Completed</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">18</p>
                                    <p className="text-xs text-gray-500 mt-1">Certificates issued</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">In Testing</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">6</p>
                                    <p className="text-xs text-gray-500 mt-1">Currently processing</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Lab Activities Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Receive Batches from Farmers</h4>
                                            <p className="text-sm text-gray-600 mt-1">Batches are sent from farmers through the mobile app. Lab receives notifications and batch details including herb type, quantity, and farm location.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Conduct Quality Testing</h4>
                                            <p className="text-sm text-gray-600 mt-1">Perform comprehensive tests including physical parameters, chemical analysis (heavy metals, pesticides), microbial testing, and advanced DNA barcoding.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Issue Quality Certificates</h4>
                                            <p className="text-sm text-gray-600 mt-1">Generate AYUSH-compliant quality certificates with test results, quality grade (A+, A, B), and compliance status. Certificates are digitally signed and stored.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Forward to Processors</h4>
                                            <p className="text-sm text-gray-600 mt-1">Approved batches with quality certificates are made available to registered processors for further processing and packaging.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Processor Management Section */}
                    {activeSection === 'processor-mgmt' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Batches Received</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">18</p>
                                    <p className="text-xs text-gray-500 mt-1">Lab-tested batches</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Packages Created</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">342</p>
                                    <p className="text-xs text-gray-500 mt-1">With QR codes</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Ready to Ship</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">298</p>
                                    <p className="text-xs text-gray-500 mt-1">Packaged units</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Processor Activities Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Receive Lab-Tested Batches</h4>
                                            <p className="text-sm text-gray-600 mt-1">Access batches that have passed lab quality tests with certificates. View quality grades, test results, and lab certificate details before processing.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Process & Package Herbs</h4>
                                            <p className="text-sm text-gray-600 mt-1">Clean, dry, grind, and package herbs according to specifications. Create packages in various sizes (25kg, 50kg, 100kg) based on requirements.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Generate QR Codes</h4>
                                            <p className="text-sm text-gray-600 mt-1">Create unique QR codes for each package containing batch information, quality certificate, processing date, and traceability data. Print and apply labels.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Supply to Manufacturers</h4>
                                            <p className="text-sm text-gray-600 mt-1">Make packaged herbs available to registered manufacturers. Track inventory, manage orders, and maintain supply chain transparency.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manufacturer Management Section */}
                    {activeSection === 'manufacturer-mgmt' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Packages Received</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">298</p>
                                    <p className="text-xs text-gray-500 mt-1">From processors</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Products Created</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">156</p>
                                    <p className="text-xs text-gray-500 mt-1">Ayurvedic formulations</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Ready for Market</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">142</p>
                                    <p className="text-xs text-gray-500 mt-1">FSSAI approved</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Manufacturer Activities Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Source Quality Herbs</h4>
                                            <p className="text-sm text-gray-600 mt-1">Receive packaged herbs from processors with complete traceability. Scan QR codes to verify quality certificates, batch information, and origin details.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Manufacture Ayurvedic Products</h4>
                                            <p className="text-sm text-gray-600 mt-1">Create traditional Ayurvedic formulations (churnas, tablets, capsules, oils) using verified quality herbs. Follow GMP standards and traditional recipes.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Quality Assurance & Compliance</h4>
                                            <p className="text-sm text-gray-600 mt-1">Ensure FSSAI compliance, maintain batch records, conduct in-house quality checks, and maintain complete documentation for regulatory requirements.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Market Distribution</h4>
                                            <p className="text-sm text-gray-600 mt-1">Distribute finished products to retailers, pharmacies, and consumers. Maintain complete supply chain transparency with herb origin traceability.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Geo Fencing Section */}
                    {activeSection === 'geo-fencing' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Geo Fencing Configuration</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Define the geographical boundaries for your traceability system. Set minimum and maximum latitude and longitude values to create a geo-fenced area.
                                </p>
                                
                                <form onSubmit={async (e) => {
                                    e.preventDefault()
                                    
                                    // Validate form
                                    const errors = {
                                        name: '',
                                        minLatitude: '',
                                        maxLatitude: '',
                                        minLongitude: '',
                                        maxLongitude: ''
                                    }
                                    let isValid = true
                                    
                                    if (!geoFencingData.name.trim()) {
                                        errors.name = 'Zone name is required'
                                        isValid = false
                                    }
                                    
                                    if (!geoFencingData.minLatitude.trim()) {
                                        errors.minLatitude = 'Minimum latitude is required'
                                        isValid = false
                                    } else {
                                        const minLat = parseFloat(geoFencingData.minLatitude)
                                        if (isNaN(minLat) || minLat < -90 || minLat > 90) {
                                            errors.minLatitude = 'Latitude must be between -90 and 90'
                                            isValid = false
                                        }
                                    }
                                    
                                    if (!geoFencingData.maxLatitude.trim()) {
                                        errors.maxLatitude = 'Maximum latitude is required'
                                        isValid = false
                                    } else {
                                        const maxLat = parseFloat(geoFencingData.maxLatitude)
                                        if (isNaN(maxLat) || maxLat < -90 || maxLat > 90) {
                                            errors.maxLatitude = 'Latitude must be between -90 and 90'
                                            isValid = false
                                        }
                                    }
                                    
                                    if (!geoFencingData.minLongitude.trim()) {
                                        errors.minLongitude = 'Minimum longitude is required'
                                        isValid = false
                                    } else {
                                        const minLng = parseFloat(geoFencingData.minLongitude)
                                        if (isNaN(minLng) || minLng < -180 || minLng > 180) {
                                            errors.minLongitude = 'Longitude must be between -180 and 180'
                                            isValid = false
                                        }
                                    }
                                    
                                    if (!geoFencingData.maxLongitude.trim()) {
                                        errors.maxLongitude = 'Maximum longitude is required'
                                        isValid = false
                                    } else {
                                        const maxLng = parseFloat(geoFencingData.maxLongitude)
                                        if (isNaN(maxLng) || maxLng < -180 || maxLng > 180) {
                                            errors.maxLongitude = 'Longitude must be between -180 and 180'
                                            isValid = false
                                        }
                                    }
                                    
                                    // Validate min < max
                                    if (isValid) {
                                        const minLat = parseFloat(geoFencingData.minLatitude)
                                        const maxLat = parseFloat(geoFencingData.maxLatitude)
                                        const minLng = parseFloat(geoFencingData.minLongitude)
                                        const maxLng = parseFloat(geoFencingData.maxLongitude)
                                        
                                        if (minLat >= maxLat) {
                                            errors.minLatitude = 'Minimum latitude must be less than maximum latitude'
                                            errors.maxLatitude = 'Maximum latitude must be greater than minimum latitude'
                                            isValid = false
                                        }
                                        
                                        if (minLng >= maxLng) {
                                            errors.minLongitude = 'Minimum longitude must be less than maximum longitude'
                                            errors.maxLongitude = 'Maximum longitude must be greater than minimum longitude'
                                            isValid = false
                                        }
                                    }
                                    
                                    setGeoFencingErrors(errors)
                                    
                                    if (!isValid) {
                                        return
                                    }
                                    
                                    setIsSubmittingGeoFencing(true)
                                    
                                    try {
                                        const token = getToken()
                                        const headers: HeadersInit = {
                                            'Content-Type': 'application/json',
                                        }
                                        
                                        if (token) {
                                            headers['Authorization'] = `Bearer ${token}`
                                        }
                                        
            const response = await fetch(`${API_BASE}/api/geofencing/zones`, {
                                            method: 'POST',
                                            headers,
                                            body: JSON.stringify({
                                                name: geoFencingData.name.trim(),
                                                minLatitude: parseFloat(geoFencingData.minLatitude),
                                                maxLatitude: parseFloat(geoFencingData.maxLatitude),
                                                minLongitude: parseFloat(geoFencingData.minLongitude),
                                                maxLongitude: parseFloat(geoFencingData.maxLongitude)
                                            }),
                                        })
                                        
                                        const data = await response.json()
                                        
                                        if (response.ok && data.success) {
                                            setGeoFencingSuccess(true)
                                            setGeoFencingError('')
                                            // Force map to show and update after successful save
                                            setShowMap(true)
                                            // Force map update by incrementing trigger
                                            setMapUpdateTrigger(prev => prev + 1)
                                            fetchApprovedZones()
                                            // Auto-hide success message after 5 seconds
                                            setTimeout(() => {
                                                setGeoFencingSuccess(false)
                                            }, 5000)
                                        } else {
                                            setGeoFencingError(data?.message || 'Failed to save geo fencing configuration')
                                            setGeoFencingSuccess(false)
                                        }
                                    } catch (error) {
                                        console.error('Error saving geo fencing:', error)
                                        setGeoFencingError('Unable to connect to server. Please try again.')
                                        setGeoFencingSuccess(false)
                                    } finally {
                                        setIsSubmittingGeoFencing(false)
                                    }
                                }} className="space-y-6">
                                    {/* Success Message */}
                                    {geoFencingSuccess && (
                                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                                            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-green-900">Configuration Saved Successfully!</h4>
                                                <p className="text-sm text-green-700">Your geo fencing zone has been saved.</p>
                                            </div>
                                            <button
                                                onClick={() => setGeoFencingSuccess(false)}
                                                className="text-green-600 hover:text-green-800 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {geoFencingError && (
                                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-red-900">Error</h4>
                                                <p className="text-sm text-red-700">{geoFencingError}</p>
                                            </div>
                                            <button
                                                onClick={() => setGeoFencingError('')}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Minimum Latitude */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Minimum Latitude <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={geoFencingData.minLatitude}
                                                onChange={(e) => {
                                                    setGeoFencingData(prev => ({ ...prev, minLatitude: e.target.value }))
                                                    if (geoFencingErrors.minLatitude) {
                                                        setGeoFencingErrors(prev => ({ ...prev, minLatitude: '' }))
                                                    }
                                                }}
                                                placeholder="e.g., 28.5 (Uttarakhand - South)"
                                                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                                    geoFencingErrors.minLatitude
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                        : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 hover:border-gray-300'
                                                }`}
                                                required
                                            />
                                            {geoFencingErrors.minLatitude && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {geoFencingErrors.minLatitude}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Range: -90 to 90 | Example: 28.5 (Uttarakhand southern boundary)</p>
                                        </div>
                                        
                                        {/* Maximum Latitude */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Maximum Latitude <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={geoFencingData.maxLatitude}
                                                onChange={(e) => {
                                                    setGeoFencingData(prev => ({ ...prev, maxLatitude: e.target.value }))
                                                    if (geoFencingErrors.maxLatitude) {
                                                        setGeoFencingErrors(prev => ({ ...prev, maxLatitude: '' }))
                                                    }
                                                }}
                                                placeholder="e.g., 31.5 (Uttarakhand - North)"
                                                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                                    geoFencingErrors.maxLatitude
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                        : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 hover:border-gray-300'
                                                }`}
                                                required
                                            />
                                            {geoFencingErrors.maxLatitude && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {geoFencingErrors.maxLatitude}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Range: -90 to 90 | Example: 31.5 (Uttarakhand northern boundary)</p>
                                        </div>
                                        
                                        {/* Minimum Longitude */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Minimum Longitude <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={geoFencingData.minLongitude}
                                                onChange={(e) => {
                                                    setGeoFencingData(prev => ({ ...prev, minLongitude: e.target.value }))
                                                    if (geoFencingErrors.minLongitude) {
                                                        setGeoFencingErrors(prev => ({ ...prev, minLongitude: '' }))
                                                    }
                                                }}
                                                placeholder="e.g., 77.0 (Uttarakhand - West)"
                                                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                                    geoFencingErrors.minLongitude
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                        : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 hover:border-gray-300'
                                                }`}
                                                required
                                            />
                                            {geoFencingErrors.minLongitude && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {geoFencingErrors.minLongitude}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Range: -180 to 180 | Example: 77.0 (Uttarakhand western boundary)</p>
                                        </div>
                                        
                                        {/* Maximum Longitude */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Maximum Longitude <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={geoFencingData.maxLongitude}
                                                onChange={(e) => {
                                                    setGeoFencingData(prev => ({ ...prev, maxLongitude: e.target.value }))
                                                    if (geoFencingErrors.maxLongitude) {
                                                        setGeoFencingErrors(prev => ({ ...prev, maxLongitude: '' }))
                                                    }
                                                }}
                                                placeholder="e.g., 81.0 (Uttarakhand - East)"
                                                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                                    geoFencingErrors.maxLongitude
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                        : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 hover:border-gray-300'
                                                }`}
                                                required
                                            />
                                            {geoFencingErrors.maxLongitude && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {geoFencingErrors.maxLongitude}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Range: -180 to 180 | Example: 81.0 (Uttarakhand eastern boundary)</p>
                                        </div>
                                    </div>
                                    
                                    {/* Zone Name Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Zone Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={geoFencingData.name}
                                            onChange={(e) => {
                                                setGeoFencingData(prev => ({ ...prev, name: e.target.value }))
                                                if (geoFencingErrors.name) {
                                                    setGeoFencingErrors(prev => ({ ...prev, name: '' }))
                                                }
                                            }}
                                            placeholder="e.g., Uttarakhand Zone, Dehradun University, etc."
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                                geoFencingErrors.name
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 hover:border-gray-300'
                                            }`}
                                            required
                                        />
                                        {geoFencingErrors.name && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {geoFencingErrors.name}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">Enter a zone name or identifier for this geo-fenced area</p>
                                    </div>
                                    
                                    {/* Info Box */}
                                    <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <h4 className="font-semibold text-teal-900 mb-1">About Geo Fencing</h4>
                                                <p className="text-sm text-teal-800">
                                                    Geo fencing allows you to define geographical boundaries for your traceability system. 
                                                    All location-based operations will be validated against these boundaries to ensure data integrity 
                                                    and compliance with regional regulations.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Submit Button */}
                                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setGeoFencingData({
                                                    name: '',
                                                    minLatitude: '',
                                                    maxLatitude: '',
                                                    minLongitude: '',
                                                    maxLongitude: ''
                                                })
                                                setGeoFencingErrors({
                                                    name: '',
                                                    minLatitude: '',
                                                    maxLatitude: '',
                                                    minLongitude: '',
                                                    maxLongitude: ''
                                                })
                                                setGeoFencingSuccess(false)
                                                setGeoFencingError('')
                                                setShowMap(false)
                                            }}
                                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingGeoFencing}
                                            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSubmittingGeoFencing ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Save Configuration</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Approved Zones */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-gray-900">Approved Zones</h4>
                                    <button
                                        type="button"
                                        onClick={fetchApprovedZones}
                                        className="text-sm font-semibold text-[#016868] hover:text-[#014d4d]"
                                    >
                                        Refresh
                                    </button>
                                </div>
                                {approvedZones.length === 0 ? (
                                    <p className="text-sm text-gray-600">No approved zones yet.</p>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {approvedZones.map((zone, idx) => (
                                            <div key={zone.id || zone.name || idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <p className="text-sm font-bold text-gray-900 truncate">{zone.name || 'Unnamed Zone'}</p>
                                                <p className="text-xs text-gray-600 mt-1">Lat: {zone.minLatitude} → {zone.maxLatitude}</p>
                                                <p className="text-xs text-gray-600">Lng: {zone.minLongitude} → {zone.maxLongitude}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Google Map Display - Shows dynamically as coordinates are entered */}
                            {showMap && geoFencingData.minLatitude && geoFencingData.maxLatitude && geoFencingData.minLongitude && geoFencingData.maxLongitude && (() => {
                                const minLat = parseFloat(geoFencingData.minLatitude)
                                const maxLat = parseFloat(geoFencingData.maxLatitude)
                                const minLng = parseFloat(geoFencingData.minLongitude)
                                const maxLng = parseFloat(geoFencingData.maxLongitude)
                                
                                // Only show if coordinates are valid
                                const isValid = !isNaN(minLat) && !isNaN(maxLat) && !isNaN(minLng) && !isNaN(maxLng) && 
                                               minLat < maxLat && minLng < maxLng &&
                                               minLat >= -90 && maxLat <= 90 && minLng >= -180 && maxLng <= 180
                                
                                if (!isValid) return null
                                
                                return (
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">Geo-Fenced Area Map</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Visual representation of the geo-fenced zone: <span className="font-semibold text-teal-700">{geoFencingData.name || 'Preview'}</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowMap(false)}
                                                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                                title="Hide map"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
                                            <div ref={mapRef} className="w-full h-full" />
                                            {(!mapsApiLoaded || mapLoading) && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                                                    <div className="text-center">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                                                        <p className="text-gray-600 font-medium">
                                                            {!mapsApiLoaded ? 'Loading Google Maps API...' : 'Updating map...'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {!mapsApiLoaded ? 'This may take a few seconds' : 'Please wait'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-teal-500 rounded border-2 border-teal-700"></div>
                                                <span>Geo-fenced boundary</span>
                                            </div>
                                            <div className="text-gray-400">|</div>
                                            <div>
                                                <span className="font-semibold">Coordinates: </span>
                                                ({geoFencingData.minLatitude}, {geoFencingData.minLongitude}) to ({geoFencingData.maxLatitude}, {geoFencingData.maxLongitude})
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()}
                        </div>
                    )}

                    {/* Settings Section */}
                    {activeSection === 'settings' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">System Configuration</h3>
                                <div className="space-y-6">
                                    {/* Website Control */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Website Control</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Maintenance Mode</p>
                                                    <p className="text-sm text-gray-500">Temporarily disable website access for maintenance</p>
                                                </div>
                                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">New Registrations</p>
                                                    <p className="text-sm text-gray-500">Allow new facility registrations</p>
                                                </div>
                                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600 transition-colors hover:bg-teal-700">
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Management */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">User Management</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Auto-Approve Labs</p>
                                                    <p className="text-sm text-gray-500">Automatically approve NABL-certified labs</p>
                                                </div>
                                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Email Notifications</p>
                                                    <p className="text-sm text-gray-500">Send email notifications to users</p>
                                                </div>
                                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600 transition-colors hover:bg-teal-700">
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Management */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Data Management</h4>
                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-between p-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    <div className="text-left">
                                                        <p className="font-medium text-gray-900">Export All Data</p>
                                                        <p className="text-xs text-gray-600">Download complete database as CSV</p>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <button className="w-full flex items-center justify-between p-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                    <div className="text-left">
                                                        <p className="font-medium text-gray-900">Generate Reports</p>
                                                        <p className="text-xs text-gray-600">Monthly analytics and statistics</p>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* System Information */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-4">System Information</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Version</p>
                                                <p className="font-semibold text-gray-900 mt-1">ANVESHA v2.0.1</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Last Updated</p>
                                                <p className="font-semibold text-gray-900 mt-1">Dec 8, 2025</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Total Users</p>
                                                <p className="font-semibold text-gray-900 mt-1">1,342</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Database Size</p>
                                                <p className="font-semibold text-gray-900 mt-1">2.4 GB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

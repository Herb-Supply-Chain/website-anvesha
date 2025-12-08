'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Batch, BatchStatus } from '@/lib/types/batch'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export default function ProcessorDashboard() {
    const router = useRouter()
    const [receivedBatches, setReceivedBatches] = useState<Batch[]>([])
    const [dryingBatches, setDryingBatches] = useState<Batch[]>([])
    const [grindingBatches, setGrindingBatches] = useState<Batch[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingBatchId, setProcessingBatchId] = useState<string | null>(null)

    useEffect(() => {
        loadBatches()
    }, [])

    const loadBatches = async () => {
        setIsLoading(true)
        try {
            const [received, drying, grinding] = await Promise.all([
                axios.get(`${API_URL}/batches?status=received`),
                axios.get(`${API_URL}/batches?status=drying`),
                axios.get(`${API_URL}/batches?status=grinding`)
            ])

            setReceivedBatches(received.data)
            setDryingBatches(drying.data)
            setGrindingBatches(grinding.data)
        } catch (error) {
            console.error('Error loading batches:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const moveBatchToNextStage = async (batchId: string, currentStatus: BatchStatus) => {
        setProcessingBatchId(batchId)
        try {
            let nextStatus: BatchStatus

            switch (currentStatus) {
                case 'received':
                    nextStatus = 'drying'
                    break
                case 'drying':
                    nextStatus = 'grinding'
                    break
                case 'grinding':
                    nextStatus = 'ready'
                    break
                default:
                    return
            }

            await axios.patch(`${API_URL}/batches`, {
                id: batchId,
                processingStage: nextStatus
            })

            // Reload batches to reflect changes
            await loadBatches()
        } catch (error) {
            console.error('Error updating batch:', error)
            alert('Failed to update batch status')
        } finally {
            setProcessingBatchId(null)
        }
    }

    const BatchCard = ({
        batch,
        statusColor,
        statusText,
        actionLabel,
        onAction
    }: {
        batch: Batch
        statusColor: string
        statusText: string
        actionLabel?: string
        onAction?: () => void
    }) => (
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-1">{batch.id}</div>
            <div className="font-semibold text-gray-900 mb-1">{batch.herb}</div>
            <div className="text-sm text-gray-600 mb-2">
                Current: {batch.weight}kg
                {batch.farmerData && (
                    <span className="text-xs text-gray-500 ml-2">
                        (Original: {batch.farmerData.originalWeight}kg)
                    </span>
                )}
            </div>

            {/* Farmer Info */}
            {batch.farmerData && (
                <div className="text-xs text-gray-500 mb-2">
                    👨‍🌾 {batch.farmerData.farmerName} | Grade: {batch.farmerData.qualityGrade}
                </div>
            )}

            {/* Processing Timeline */}
            {batch.receivedDate && (
                <div className="text-xs text-gray-500 mb-2">
                    📅 Received: {batch.receivedDate}
                </div>
            )}

            {/* Weight Loss Indicator */}
            {batch.processingData && batch.processingData.totalLoss && batch.processingData.totalLoss > 0 && (
                <div className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded mb-2">
                    ⚠️ Loss: {batch.processingData.totalLoss.toFixed(1)}%
                </div>
            )}

            <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {statusText}
                </span>

                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        disabled={processingBatchId === batch.id}
                        className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processingBatchId === batch.id ? '...' : actionLabel}
                    </button>
                )}
            </div>
        </div>
    )

    const ProcessingStage = ({
        title,
        batches,
        statusColor,
        statusText,
        icon,
        actionLabel,
        onBatchAction
    }: {
        title: string
        batches: Batch[]
        statusColor: string
        statusText: string
        icon: string
        actionLabel?: string
        onBatchAction?: (batchId: string) => void
    }) => (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{icon}</span>
                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{batches.length} batches</p>
                </div>
            </div>
            <div className="space-y-3">
                {batches.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        No batches in this stage
                    </div>
                ) : (
                    batches.map(batch => (
                        <BatchCard
                            key={batch.id}
                            batch={batch}
                            statusColor={statusColor}
                            statusText={statusText}
                            actionLabel={actionLabel}
                            onAction={onBatchAction ? () => onBatchAction(batch.id) : undefined}
                        />
                    ))
                )}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-[#014848] text-white p-4">
                <div className="flex items-center gap-3">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Processor Dashboard</h1>
                    <p className="text-gray-600">Batch Processing Overview</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Batches', value: receivedBatches.length + dryingBatches.length + grindingBatches.length, color: 'bg-blue-50 text-blue-700' },
                        { label: 'In Processing', value: dryingBatches.length + grindingBatches.length, color: 'bg-orange-50 text-orange-700' },
                        { label: 'Received', value: receivedBatches.length, color: 'bg-yellow-50 text-yellow-700' },
                        { label: 'Ready for Lab', value: 0, color: 'bg-green-50 text-green-700' }
                    ].map((stat) => (
                        <div key={stat.label} className={`p-4 rounded-lg ${stat.color}`}>
                            <div className="text-sm font-medium opacity-75">{stat.label}</div>
                            <div className="text-3xl font-bold mt-1">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Batch Processing Pipeline */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Batch Processing Pipeline</h2>
                    <p className="text-gray-600 mb-6">Click action buttons to move batches through processing stages</p>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading batches...</div>
                    ) : (
                        <div className="grid grid-cols-3 gap-6">
                            <ProcessingStage
                                title="Received"
                                batches={receivedBatches}
                                statusColor="bg-blue-100 text-blue-700"
                                statusText="New"
                                icon="📥"
                                actionLabel="Start Drying →"
                                onBatchAction={(id) => moveBatchToNextStage(id, 'received')}
                            />
                            <ProcessingStage
                                title="Drying"
                                batches={dryingBatches}
                                statusColor="bg-orange-100 text-orange-700"
                                statusText="Drying"
                                icon="☀️"
                                actionLabel="Start Grinding →"
                                onBatchAction={(id) => moveBatchToNextStage(id, 'drying')}
                            />
                            <ProcessingStage
                                title="Grinding"
                                batches={grindingBatches}
                                statusColor="bg-purple-100 text-purple-700"
                                statusText="Grinding"
                                icon="⚙️"
                                actionLabel="Mark Ready →"
                                onBatchAction={(id) => moveBatchToNextStage(id, 'grinding')}
                            />
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => router.push('/processor/packaging')}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <span>📦</span>
                            <span>Generate QR Codes</span>
                        </button>
                        <button
                            onClick={loadBatches}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <span>🔄</span>
                            <span>Refresh Data</span>
                        </button>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <span>📊</span>
                            <span>View Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}



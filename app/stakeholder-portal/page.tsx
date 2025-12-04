'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Sprout, FlaskConical, Factory, Box, Shield } from 'lucide-react';

export default function StakeholderPortal() {
    const stakeholders = [
        {
            icon: Sprout,
            title: 'Farmer / Collector',
            description: 'Manage herb collection and geo-tagged records',
            href: '/dashboard',
            color: 'teal'
        },
        {
            icon: FlaskConical,
            title: 'Laboratory',
            description: 'Quality testing and certification',
            href: '/lab-auth',
            color: 'blue'
        },
        {
            icon: Factory,
            title: 'Processor',
            description: 'Processing and manufacturing operations',
            href: '/processor-auth',
            color: 'purple'
        },
        {
            icon: Box,
            title: 'Packaging Unit',
            description: 'Final packaging and QR code generation',
            href: '/packaging-auth',
            color: 'orange'
        },
        {
            icon: Shield,
            title: 'Administrator',
            description: 'System administration and oversight',
            href: '/admin-auth',
            color: 'red'
        }
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; hover: string; icon: string }> = {
            teal: { bg: 'bg-teal-50', hover: 'hover:bg-teal-100', icon: 'text-teal-600' },
            blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', icon: 'text-blue-600' },
            purple: { bg: 'bg-purple-50', hover: 'hover:bg-purple-100', icon: 'text-purple-600' },
            orange: { bg: 'bg-orange-50', hover: 'hover:bg-orange-100', icon: 'text-orange-600' },
            red: { bg: 'bg-red-50', hover: 'hover:bg-red-100', icon: 'text-red-600' }
        };
        return colors[color];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-3">
                    <Link href="/" className="flex items-center gap-3">
                        <Leaf className="w-8 h-8" />
                        <div>
                            <h1 className="text-lg font-bold">Government of India | www.gov.in</h1>
                            <p className="text-xs text-teal-100">Ministry of AYUSH | Stakeholder Portal</p>
                        </div>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Title Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Stakeholder Access</h2>
                        <p className="text-lg text-gray-600">
                            Select your role to access your dashboard and manage operations
                        </p>
                    </div>

                    {/* Stakeholder Cards Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {stakeholders.map((stakeholder) => {
                            const Icon = stakeholder.icon;
                            const colors = getColorClasses(stakeholder.color);

                            return (
                                <Link
                                    key={stakeholder.title}
                                    href={stakeholder.href}
                                    className={`${colors.bg} ${colors.hover} border-2 border-gray-200 rounded-lg p-8 transition-all duration-200 hover:shadow-lg hover:border-${stakeholder.color}-300 group`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 ${colors.bg} rounded-lg group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-8 h-8 ${colors.icon}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{stakeholder.title}</h3>
                                            <p className="text-sm text-gray-600">{stakeholder.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Info Section */}
                    <div className="mt-12 bg-teal-50 border border-teal-200 rounded-lg p-6">
                        <h3 className="font-semibold text-teal-900 mb-2">Need Access?</h3>
                        <p className="text-sm text-teal-800">
                            If you don't have access credentials, please contact your organization administrator
                            or reach out to the Ministry of AYUSH support team for assistance.
                        </p>
                    </div>

                    {/* Bottom Link */}
                    <div className="text-center mt-8">
                        <Link href="/" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-teal-100">© 2024 Ministry of AYUSH, Government of India. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

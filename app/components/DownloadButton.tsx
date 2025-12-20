'use client'

import Link from 'next/link';
import { Smartphone } from 'lucide-react'; // Optional: cute Android icon (install lucide-react if not already)

export function DownloadButton() {
  return (
  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link
          href="https://github.com/Herb-Supply-Chain/website-anvesha/releases/download/v1.0.0/anvesha.apk"
          target="_blank"
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-white text-emerald-700 font-medium text-sm rounded shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-95"
        >
          <Smartphone className="w-5 h-5" />
          Get the App
        </Link>
      </div>
  );
}
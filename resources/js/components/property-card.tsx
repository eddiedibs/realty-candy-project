import React from 'react';
import { Property } from '@/types';

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 mb-4 w-full max-w-2xl">
            <div className="flex items-center gap-4">
                {/* Logo / placeholder */}
                <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                        src={`/storage/properties/${property.image_name}`} // e.g. property1.jpg
                        alt="Property"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Property Info */}
                <div className="flex flex-col">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        ${property.price.toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-sm dark:text-gray-300">
                        {property.address}
                    </div>
                    <div className="text-gray-800 text-sm mt-1 dark:text-gray-200">
                        {property.description}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>🛏 {property.bedroom}</span>
                        <span>🛁 {property.bathroom}</span>
                        <span>📐 {property.square_footage} sqft</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

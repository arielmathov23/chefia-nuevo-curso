'use client';

import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary-600 mb-4">Test Page</h1>
        <p className="text-gray-700 mb-6">
          This is a test page to check if Tailwind CSS styles are being applied correctly.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-primary-100 rounded-md">
            <p className="text-primary-800">This should have primary colors.</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-md">
            <p className="text-blue-800">This should have blue colors.</p>
          </div>
          <div className="p-4 bg-red-100 rounded-md">
            <p className="text-red-800">This should have red colors.</p>
          </div>
        </div>
        <button className="mt-6 w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
          Test Button
        </button>
      </div>
    </div>
  );
} 
'use client';

import React, { useState } from 'react';
import Layout from '../../components/Layout';
import FoodPreferences, { DietaryPreferences } from '../../components/FoodPreferences';
import Link from 'next/link';

export default function Preferences() {
  const [preferences, setPreferences] = useState<DietaryPreferences>({
    restrictions: [],
    preferences: [],
    additionalNotes: ''
  });
  const [saved, setSaved] = useState(false);

  const handlePreferencesChange = (updatedPreferences: DietaryPreferences) => {
    setPreferences(updatedPreferences);
    setSaved(true);
    
    // Reset the saved notification after 3 seconds
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Dietary Preferences
          </h1>
          <p className="text-lg text-gray-600">
            Customize your dietary restrictions and cuisine preferences
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Always show preferences UI on this page */}
          <div className="mb-4">
            <FoodPreferences onPreferencesChange={handlePreferencesChange} />
          </div>
          
          {saved && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your preferences have been saved successfully!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <Link
              href="/recipes"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Generate Recipes with These Preferences
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
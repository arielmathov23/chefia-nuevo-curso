'use client';

import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { usePathname } from 'next/navigation';

export interface DietaryPreferences {
  restrictions: string[];
  preferences: string[];
  additionalNotes: string;
}

interface FoodPreferencesProps {
  onPreferencesChange: (preferences: DietaryPreferences) => void;
}

const FoodPreferences: React.FC<FoodPreferencesProps> = ({ onPreferencesChange }) => {
  const pathname = usePathname();
  const isPreferencesPage = pathname === '/preferences';

  // Common dietary restrictions
  const commonRestrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Shellfish-Free',
    'Kosher',
    'Halal',
    'Low-Carb',
    'Keto',
    'Paleo'
  ];

  // Common cuisine preferences
  const commonPreferences = [
    'Italian',
    'Mexican',
    'Asian',
    'Mediterranean',
    'Indian',
    'American',
    'French',
    'Middle Eastern',
    'Thai',
    'Japanese',
    'Chinese',
    'Greek',
    'Spanish'
  ];

  // Use localStorage to persist user preferences
  const [savedPreferences, setSavedPreferences] = useLocalStorage<DietaryPreferences>('food_preferences', {
    restrictions: [],
    preferences: [],
    additionalNotes: ''
  });

  // Local state for UI
  const [showPreferences, setShowPreferences] = useState(isPreferencesPage);
  const [additionalNotes, setAdditionalNotes] = useState(savedPreferences.additionalNotes);

  // Initialize local state from localStorage
  useEffect(() => {
    setAdditionalNotes(savedPreferences.additionalNotes);
  }, [savedPreferences.additionalNotes]);

  // Notify parent component when preferences change
  useEffect(() => {
    onPreferencesChange(savedPreferences);
  }, [savedPreferences, onPreferencesChange]);

  // Toggle a restriction
  const toggleRestriction = (restriction: string) => {
    setSavedPreferences(prev => {
      const newRestrictions = prev.restrictions.includes(restriction)
        ? prev.restrictions.filter(r => r !== restriction)
        : [...prev.restrictions, restriction];
      
      return {
        ...prev,
        restrictions: newRestrictions
      };
    });
  };

  // Toggle a preference
  const togglePreference = (preference: string) => {
    setSavedPreferences(prev => {
      const newPreferences = prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference];
      
      return {
        ...prev,
        preferences: newPreferences
      };
    });
  };

  // Save additional notes
  const saveAdditionalNotes = () => {
    setSavedPreferences(prev => ({
      ...prev,
      additionalNotes
    }));
  };

  // Check if any preferences are set
  const hasPreferences = savedPreferences.restrictions.length > 0 || 
                         savedPreferences.preferences.length > 0 || 
                         savedPreferences.additionalNotes.trim() !== '';

  return (
    <div className={isPreferencesPage ? '' : 'mb-6'}>
      {!isPreferencesPage && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900 mr-2">Dietary Preferences</h3>
            {hasPreferences && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {savedPreferences.restrictions.length + savedPreferences.preferences.length} Selected
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
          >
            {showPreferences ? 'Hide' : 'Edit'} Preferences
            <svg 
              className={`ml-1 h-5 w-5 transform transition-transform ${showPreferences ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {hasPreferences && !showPreferences && !isPreferencesPage && (
        <div className="bg-gray-50 rounded-md p-3 text-sm">
          {savedPreferences.restrictions.length > 0 && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Restrictions:</span>{' '}
              <span className="text-gray-600">{savedPreferences.restrictions.join(', ')}</span>
            </div>
          )}
          {savedPreferences.preferences.length > 0 && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Preferences:</span>{' '}
              <span className="text-gray-600">{savedPreferences.preferences.join(', ')}</span>
            </div>
          )}
          {savedPreferences.additionalNotes.trim() !== '' && (
            <div>
              <span className="font-medium text-gray-700">Additional Notes:</span>{' '}
              <span className="text-gray-600">{savedPreferences.additionalNotes}</span>
            </div>
          )}
        </div>
      )}

      {(showPreferences || isPreferencesPage) && (
        <div className={isPreferencesPage ? '' : 'mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4'}>
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">Dietary Restrictions</h4>
            <div className="flex flex-wrap gap-2">
              {commonRestrictions.map(restriction => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => toggleRestriction(restriction)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    savedPreferences.restrictions.includes(restriction)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {restriction}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">Cuisine Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {commonPreferences.map(preference => (
                <button
                  key={preference}
                  type="button"
                  onClick={() => togglePreference(preference)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    savedPreferences.preferences.includes(preference)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {preference}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">Additional Notes</h4>
            <div className="flex">
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any other preferences or allergies? (e.g., low sodium, no cilantro, etc.)"
                className="flex-grow input-field min-h-[80px] resize-none"
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={saveAdditionalNotes}
                className="text-sm bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodPreferences; 
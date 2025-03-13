'use client';

import React, { useState } from 'react';
import { Ingredient } from '../types/ingredient';
import { DietaryPreferences } from './FoodPreferences';
import Link from 'next/link';

interface RecipeGeneratorProps {
  ingredients: Ingredient[];
  dietaryPreferences: DietaryPreferences;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ ingredients, dietaryPreferences }) => {
  const [recipe, setRecipe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Please add some ingredients to your inventory first');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ingredients,
          dietaryPreferences 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recipe');
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format the recipe text with proper line breaks and styling
  const formatRecipeText = (text: string) => {
    // Split by new lines
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Check if line is a header (ends with a colon or is all caps)
      const isHeader = line.trim().endsWith(':') || 
                      (line.trim() === line.trim().toUpperCase() && line.trim().length > 0);
      
      // Check if line is a numbered step
      const isStep = /^\d+\./.test(line.trim());
      
      // Apply appropriate styling
      if (isHeader) {
        return (
          <h3 key={index} className="text-xl font-semibold text-primary-700 mt-4 mb-2">
            {line}
          </h3>
        );
      } else if (isStep) {
        return (
          <p key={index} className="my-2 pl-4">
            <span className="font-medium">{line}</span>
          </p>
        );
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="my-1">{line}</p>;
      }
    });
  };

  // Format dietary preferences for display
  const formatDietaryInfo = () => {
    const parts: string[] = [];
    
    if (dietaryPreferences.restrictions.length > 0) {
      parts.push(`Restrictions: ${dietaryPreferences.restrictions.join(', ')}`);
    }
    
    if (dietaryPreferences.preferences.length > 0) {
      parts.push(`Preferences: ${dietaryPreferences.preferences.join(', ')}`);
    }
    
    if (dietaryPreferences.additionalNotes.trim()) {
      parts.push(`Notes: ${dietaryPreferences.additionalNotes}`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'No dietary preferences set';
  };

  // Check if any dietary preferences are set
  const hasPreferences = dietaryPreferences.restrictions.length > 0 || 
                         dietaryPreferences.preferences.length > 0 || 
                         dietaryPreferences.additionalNotes.trim() !== '';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Generate a Recipe</h2>
        <button
          onClick={generateRecipe}
          disabled={isLoading || ingredients.length === 0}
          className={`px-4 py-2 rounded-md text-white transition-colors duration-200 ${
            isLoading || ingredients.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Recipe'}
        </button>
      </div>

      {hasPreferences && (
        <div className="mb-4 bg-gray-50 rounded-md p-3 text-sm">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <span className="font-medium text-gray-700">Using your dietary preferences:</span>{' '}
              <span className="text-gray-600">{formatDietaryInfo()}</span>
              <div className="mt-1">
                <Link href="/preferences" className="text-xs text-primary-600 hover:text-primary-800">
                  Edit Preferences
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {!hasPreferences && (
        <div className="mb-4 bg-gray-50 rounded-md p-3 text-sm">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-gray-600">No dietary preferences set.</span>{' '}
              <Link href="/preferences" className="text-primary-600 hover:text-primary-800">
                Set preferences
              </Link>{' '}
              <span className="text-gray-600">to get more personalized recipes.</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Crafting a delicious recipe just for you...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      )}

      {recipe && !isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-4">
          <div className="prose max-w-none">
            {formatRecipeText(recipe)}
          </div>
        </div>
      )}

      {!recipe && !isLoading && !error && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No recipe generated yet</h3>
          <p className="mt-1 text-gray-500">
            Click the "Generate Recipe" button to create a recipe based on your ingredients
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator; 
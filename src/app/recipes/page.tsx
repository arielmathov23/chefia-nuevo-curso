'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import RecipeGenerator from '../../components/RecipeGenerator';
import { Ingredient } from '../../types/ingredient';
import { DietaryPreferences } from '../../components/FoodPreferences';
import Link from 'next/link';

export default function Recipes() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreferences>({
    restrictions: [],
    preferences: [],
    additionalNotes: ''
  });

  // Load ingredients from localStorage
  useEffect(() => {
    const storedIngredients = localStorage.getItem('ingredients');
    if (storedIngredients) {
      setIngredients(JSON.parse(storedIngredients));
    }

    const storedPreferences = localStorage.getItem('food_preferences');
    if (storedPreferences) {
      setDietaryPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Recipe Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create delicious recipes based on your available ingredients
          </p>
        </div>

        {ingredients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No ingredients in your inventory</h3>
            <p className="mt-1 text-gray-500 mb-4">
              Add ingredients to your inventory first to generate recipes
            </p>
            <Link
              href="/inventory"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Go to Inventory
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Your Ingredients</h2>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                  </span>
                ))}
              </div>
              <div className="mt-2">
                <Link
                  href="/inventory"
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Edit Ingredients
                </Link>
              </div>
            </div>
            
            <RecipeGenerator 
              ingredients={ingredients} 
              dietaryPreferences={dietaryPreferences} 
            />
          </div>
        )}
      </div>
    </Layout>
  );
} 
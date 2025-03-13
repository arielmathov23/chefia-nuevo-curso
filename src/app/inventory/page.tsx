'use client';

import React, { useState } from 'react';
import Layout from '../../components/Layout';
import IngredientInput from '../../components/IngredientInput';
import { Ingredient } from '../../types/ingredient';

export default function Inventory() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const handleIngredientsChange = (updatedIngredients: Ingredient[]) => {
    setIngredients(updatedIngredients);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Kitchen Inventory
          </h1>
          <p className="text-lg text-gray-600">
            Manage your ingredients and keep track of what you have in stock
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <IngredientInput onIngredientsChange={handleIngredientsChange} />
          
          {ingredients.length > 0 && (
            <div className="mt-8 flex justify-center">
              <a 
                href="/recipes" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Generate Recipes with These Ingredients
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 
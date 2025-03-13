'use client';

import React, { useState, useEffect } from 'react';
import { Ingredient } from '../types/ingredient';
import useLocalStorage from '../hooks/useLocalStorage';

interface IngredientInputProps {
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onIngredientsChange }) => {
  // Use localStorage to persist ingredients
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>('ingredients', []);
  
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Common ingredients for suggestions
  const commonIngredients = [
    'Chicken', 'Beef', 'Pork', 'Salmon', 'Tuna',
    'Rice', 'Pasta', 'Bread', 'Flour', 'Sugar',
    'Salt', 'Pepper', 'Olive Oil', 'Butter',
    'Onion', 'Garlic', 'Tomato', 'Potato', 'Carrot',
    'Broccoli', 'Spinach', 'Lettuce', 'Bell Pepper',
    'Milk', 'Cheese', 'Yogurt', 'Eggs', 'Lemon',
    'Apple', 'Banana', 'Orange', 'Avocado',
    'Beans', 'Chickpeas', 'Lentils', 'Quinoa',
    'Soy Sauce', 'Vinegar', 'Honey', 'Maple Syrup',
    'Cinnamon', 'Cumin', 'Paprika', 'Oregano', 'Basil',
    'Chocolate', 'Vanilla Extract', 'Baking Powder', 'Baking Soda'
  ];

  // Common units for dropdown
  const commonUnits = [
    'g', 'kg', 'oz', 'lb',
    'ml', 'l', 'cup', 'tbsp', 'tsp',
    'piece', 'slice', 'whole', 'clove', 'bunch',
    'can', 'package', 'pinch'
  ];

  // Notify parent component when ingredients change
  useEffect(() => {
    onIngredientsChange(ingredients);
  }, [ingredients, onIngredientsChange]);

  // Handle ingredient name input and show suggestions
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    if (value.length > 0) {
      const filtered = commonIngredients.filter(
        ingredient => ingredient.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion: string) => {
    setName(suggestion);
    setShowSuggestions(false);
  };

  // Add ingredient to the list
  const addIngredient = () => {
    if (name.trim() && quantity.trim() && unit.trim()) {
      const newIngredient: Ingredient = {
        id: Date.now().toString(),
        name: name.trim(),
        quantity: parseFloat(quantity),
        unit: unit.trim()
      };
      
      setIngredients([...ingredients, newIngredient]);
      
      // Reset form
      setName('');
      setQuantity('');
      setUnit('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Remove ingredient from the list
  const removeIngredient = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Ingredients</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ingredient Name Input with Autocomplete */}
          <div className="relative">
            <label htmlFor="ingredient-name" className="block text-sm font-medium text-gray-700 mb-1">
              Ingredient
            </label>
            <input
              type="text"
              id="ingredient-name"
              value={name}
              onChange={handleNameChange}
              onFocus={() => name.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="e.g. Chicken"
              className="input-field"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quantity Input */}
          <div>
            <label htmlFor="ingredient-quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="ingredient-quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 500"
              min="0"
              step="0.1"
              className="input-field"
            />
          </div>

          {/* Unit Dropdown */}
          <div>
            <label htmlFor="ingredient-unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              id="ingredient-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="input-field"
            >
              <option value="" disabled>Select unit</option>
              {commonUnits.map((unit, index) => (
                <option key={index} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={addIngredient}
            disabled={!name.trim() || !quantity.trim() || !unit.trim()}
            className={`px-4 py-2 rounded-md text-white transition-colors duration-200 ${
              !name.trim() || !quantity.trim() || !unit.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            Add Ingredient
          </button>
        </div>
      </div>

      {/* Ingredients List */}
      {ingredients.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Ingredients</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <span className="font-medium text-gray-900">{ingredient.name}</span>
                    <span className="ml-2 text-gray-500">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientInput; 
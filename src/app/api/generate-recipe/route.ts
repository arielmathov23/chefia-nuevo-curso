import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { ingredients, dietaryPreferences } = await request.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid list of ingredients' },
        { status: 400 }
      );
    }

    // Format ingredients for the prompt
    const ingredientsList = ingredients
      .map(ing => `${ing.name} (${ing.quantity} ${ing.unit})`)
      .join(', ');

    // Format dietary restrictions and preferences
    let dietaryInfo = '';
    if (dietaryPreferences) {
      const { restrictions, preferences, additionalNotes } = dietaryPreferences;
      
      if (restrictions && restrictions.length > 0) {
        dietaryInfo += `\nDietary Restrictions: ${restrictions.join(', ')}`;
      }
      
      if (preferences && preferences.length > 0) {
        dietaryInfo += `\nCuisine Preferences: ${preferences.join(', ')}`;
      }
      
      if (additionalNotes && additionalNotes.trim()) {
        dietaryInfo += `\nAdditional Notes: ${additionalNotes}`;
      }
    }

    // Create the prompt for OpenAI
    const prompt = `Generate a recipe using some or all of these ingredients: ${ingredientsList}.
    ${dietaryInfo ? `\nPlease consider the following dietary information:${dietaryInfo}` : ''}
    
    The recipe should include:
    1. A creative name for the dish
    2. A brief description
    3. List of ingredients with measurements
    4. Step-by-step cooking instructions
    5. Approximate cooking time
    6. Difficulty level (Easy, Medium, Hard)
    7. Number of servings
    
    Format the response in a structured way that's easy to read.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract the recipe from the response
    const recipe = completion.choices[0].message.content;

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
} 
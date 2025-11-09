import type { Persona, MenuProposal } from '../types';

// This function now calls our own serverless function endpoint, configured for Vercel.
const callApiFunction = async (payload: object) => {
  const response = await fetch('/api/getAiRecipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Serverless function error:', errorBody);
    throw new Error(`Serverless function failed with status: ${response.status}`);
  }

  return response.json();
}


export const getMenuProposals = async (
  persona: Persona,
  ingredients: string,
  situation: string,
  constraints: string
): Promise<MenuProposal[]> => {
  
  const payload = {
    type: 'proposals',
    persona,
    ingredients,
    situation,
    constraints,
  };

  const data = await callApiFunction(payload);
  
  // Parse the response text to extract menu proposals
  const proposals: MenuProposal[] = [];
  const lines = data.text.split('\n').filter((line: string) => line.trim().length > 0);
  
  for (const line of lines) {
      const match = line.match(/(\d+\.\s*)?\*\*(.*?):\*\*\s*(.*)/);
      if (match && match[2] && match[3]) {
          proposals.push({
              name: match[2].trim(),
              reason: match[3].trim()
          });
      }
  }

  if (proposals.length === 0) {
    console.error("Original Text from API:", data.text);
    throw new Error("Could not parse menu proposals from the API response.");
  }

  return proposals;
};


export const getDetailedRecipe = async (
  persona: Persona,
  ingredients: string,
  situation: string,
  constraints: string,
  selectedMenuName: string
): Promise<string> => {
    
    const payload = {
      type: 'recipe',
      persona,
      ingredients,
      situation,
      constraints,
      selectedMenuName
    };

    const data = await callApiFunction(payload);
    return data.text;
};
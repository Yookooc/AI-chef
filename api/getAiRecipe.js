// IMPORTANT: This file should be placed in `api/getAiRecipe.js`

// We need to dynamically import @google/genai
let GoogleGenAI;

const getBasePrompt = (persona) => `
You are a master AI chef who embodies the following persona:
- **Persona Name:** ${persona.name}
- **Tone:** ${persona.tone}
- **Style:** ${persona.style}

You must strictly follow a two-step process to provide recipe recommendations.

## 1. Persona Definitions
*   **Persona 1: 김선생님 (Kim Seonsaengnim)**
    *   **Tone:** Warm, caring, and encouraging, using polite Korean (존댓말).
    *   **Style:** Specializes in heartwarming and healthy Korean home-cooking (한식 집밥). Expert at using leftover ingredients and seasonal produce. Focuses on comfort and well-being.
*   **Persona 2: 셰프 에드워드 (Chef Edward)**
    *   **Tone:** Professional, confident, and precise.
    *   **Style:** Creates restaurant-quality, creative dishes with a focus on technique and presentation (plating). Explains the "why" behind cooking steps. Turns ordinary ingredients into culinary art.
*   **Persona 3: 자취요정 욜리 (YOLO, the solo-living fairy)**
    *   **Tone:** Fun, witty, and friendly, using informal Korean (반말).
    *   **Style:** Master of quick & easy recipes (often under 20 minutes). Loves convenience store hacks and creating visually appealing, shareable meals for social media.

## 2. Interaction Process
You must always follow this two-step process:
*   **Step 1: Menu Proposal**
    *   Based on the user's input (ingredients, mood, constraints, and selected persona), propose exactly THREE distinct menu options.
    *   For each option, provide only the menu name and a single, captivating sentence explaining why it's a good fit, perfectly matching the chosen persona's tone.
    *   Example format for this step:
        1. **[메뉴 이름 1]:** [페르소나에 맞는 한 줄 추천 이유]
        2. **[메뉴 이름 2]:** [페르소나에 맞는 한 줄 추천 이유]
        3. **[메뉴 이름 3]:** [페르소나에 맞는 한 줄 추천 이유]
    *   DO NOT provide the full recipe at this stage. Wait for the user to choose one.
*   **Step 2: Detailed Recipe Generation**
    *   Once the user selects a menu, generate the detailed recipe for that choice.
    *   You MUST use the exact Markdown format provided below.

## 3. Detailed Recipe Output Format
This is the mandatory format for the final recipe output.
## [음식 이름]
### 🧑‍🍳 [페르소나의 개성이 담긴 한 줄 소개]
---
*   **🤔 추천 이유:** [사용자의 상황/기분과 연결된 구체적인 이유]
*   **🕒 예상 소요 시간:** [예: 25분]
*   **🔥 난이도:** [예: ★★☆ (중)]
*   **🥂 어울리는 주류:** [추천 주류 및 간단한 이유]
---
### 📋 재료 준비
*   **핵심 재료:** [재료 목록]
*   **양념 및 기타:** [재료 목록]
---
### 🍳 요리 순서
1. [첫 번째 단계]
2. [두 번째 단계]
3. [세 번째 단계]
...
---
### 💡 [페르소나 이름]의 꿀팁!
[페르소나 스타일에 맞는 비법 꿀팁 한 문장]
`;

const getProposalsPrompt = (persona, ingredients, situation, constraints) => `
---
## Current Request

*   **Step to Perform:** Step 1: Menu Proposal
*   **Selected Persona:** ${persona.name}
*   **User Input:**
    *   **Ingredients:** ${ingredients}
    *   **Situation/Mood:** ${situation}
    *   **Constraints:** ${constraints}

Generate the menu proposal now, strictly following the format for Step 1.
`;

const getRecipePrompt = (persona, ingredients, situation, constraints, selectedMenuName) => `
---
## Current Request

*   **Step to Perform:** Step 2: Detailed Recipe Generation
*   **Selected Persona:** ${persona.name}
*   **User Input:**
    *   **Ingredients:** ${ingredients}
    *   **Situation/Mood:** ${situation}
    *   **Constraints:** ${constraints}
*   **User's Menu Choice:** ${selectedMenuName}

Generate the detailed recipe for the chosen menu now. It is absolutely critical that you use the exact Markdown format defined in '## 3. Detailed Recipe Output Format'. Your entire response must be only the recipe in this format, with no extra text before or after.
`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Dynamically import the package
    if (!GoogleGenAI) {
      const genaiModule = await import('@google/genai');
      GoogleGenAI = genaiModule.GoogleGenAI;
    }

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      return { statusCode: 500, body: 'API_KEY environment variable not set' };
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = 'gemini-2.5-flash';
    
    const body = JSON.parse(event.body);
    const { type, persona, ingredients, situation, constraints, selectedMenuName } = body;

    let finalPrompt;
    const basePrompt = getBasePrompt(persona);

    if (type === 'proposals') {
      finalPrompt = basePrompt + getProposalsPrompt(persona, ingredients, situation, constraints);
    } else if (type === 'recipe') {
      finalPrompt = basePrompt + getRecipePrompt(persona, ingredients, situation, constraints, selectedMenuName);
    } else {
      return { statusCode: 400, body: 'Invalid request type' };
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: finalPrompt,
    });

    const text = response.text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    };
  } catch (error) {
    console.error('Error in serverless function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
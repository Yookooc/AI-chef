
import React, { useState, useCallback } from 'react';
import type { Persona, PersonaKey, MenuProposal } from './types';
import { PERSONAS } from './constants';
import PersonaSelector from './components/PersonaSelector';
import InputForm from './components/InputForm';
import RecipeDisplay from './components/RecipeDisplay';
import { getMenuProposals, getDetailedRecipe } from './services/geminiService';

type AppState = 'initial' | 'proposing' | 'proposed' | 'generating' | 'recipe' | 'error';

export default function App() {
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<PersonaKey | null>(null);
  const [userInput, setUserInput] = useState({
    ingredients: '돼지고기 목살 300g, 남은 깻잎, 양파 반 개, 유통기한 임박한 두부',
    situation: '중요한 발표를 성공적으로 마쳐서 기분이 아주 좋아요. 스트레스가 풀리는 맛있는 음식으로 자축하고 싶어요.',
    constraints: '저녁 식사, 2인분',
  });
  const [menuProposals, setMenuProposals] = useState<MenuProposal[]>([]);
  const [recipe, setRecipe] = useState<string>('');
  const [appState, setAppState] = useState<AppState>('initial');
  const [error, setError] = useState<string | null>(null);

  const handleGetProposals = useCallback(async () => {
    if (!selectedPersonaKey) {
      setError('먼저 페르소나를 선택해주세요!');
      setAppState('error');
      return;
    }
    setAppState('proposing');
    setError(null);
    setRecipe('');
    setMenuProposals([]);

    try {
      const persona = PERSONAS[selectedPersonaKey];
      const proposals = await getMenuProposals(persona, userInput.ingredients, userInput.situation, userInput.constraints);
      setMenuProposals(proposals);
      setAppState('proposed');
    } catch (err) {
      console.error(err);
      setError('메뉴 추천을 받는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setAppState('error');
    }
  }, [selectedPersonaKey, userInput]);

  const handleSelectMenu = useCallback(async (menuName: string) => {
    if (!selectedPersonaKey) return;
    setAppState('generating');
    setError(null);

    try {
      const persona = PERSONAS[selectedPersonaKey];
      const detailedRecipe = await getDetailedRecipe(persona, userInput.ingredients, userInput.situation, userInput.constraints, menuName);
      setRecipe(detailedRecipe);
      setAppState('recipe');
    } catch (err) {
      console.error(err);
      setError('레시피를 생성하는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setAppState('error');
    }
  }, [selectedPersonaKey, userInput]);
  
  const handleReset = () => {
    setSelectedPersonaKey(null);
    setMenuProposals([]);
    setRecipe('');
    setAppState('initial');
    setError(null);
  };

  const selectedPersona = selectedPersonaKey ? PERSONAS[selectedPersonaKey] : null;

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">AI 셰프의 주방</h1>
          <p className="text-lg text-gray-600 mt-2">세 명의 AI 셰프가 당신만을 위한 특별한 레시피를 만들어 드립니다.</p>
        </header>

        {appState !== 'initial' && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              처음으로 돌아가기
            </button>
          </div>
        )}

        <div className="space-y-8">
          <PersonaSelector
            selectedPersonaKey={selectedPersonaKey}
            onSelectPersona={setSelectedPersonaKey}
            disabled={appState !== 'initial'}
          />

          {selectedPersonaKey && (
            <InputForm
              userInput={userInput}
              onUserInput={setUserInput}
              onSubmit={handleGetProposals}
              isLoading={appState === 'proposing' || appState === 'generating'}
              disabled={appState !== 'initial' && appState !== 'proposed' && appState !== 'error'}
            />
          )}

          <RecipeDisplay
            state={appState}
            persona={selectedPersona}
            proposals={menuProposals}
            recipe={recipe}
            error={error}
            onSelectMenu={handleSelectMenu}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} AI Chef's Kitchen. All rights reserved.
      </footer>
    </div>
  );
}

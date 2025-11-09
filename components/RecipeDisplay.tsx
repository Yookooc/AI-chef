import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Persona, MenuProposal } from '../types';

interface RecipeDisplayProps {
  state: 'initial' | 'proposing' | 'proposed' | 'generating' | 'recipe' | 'error';
  persona: Persona | null;
  proposals: MenuProposal[];
  recipe: string;
  error: string | null;
  onSelectMenu: (menuName: string) => void;
}

const LoadingIndicator: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm text-center">
    <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-lg font-semibold text-gray-700">{text}</p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm" role="alert">
    <p className="font-bold">오류 발생</p>
    <p>{message}</p>
  </div>
);

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ state, persona, proposals, recipe, error, onSelectMenu }) => {
  if (state === 'initial') {
    return null;
  }
  if (state === 'error' && error) {
    return <ErrorDisplay message={error} />;
  }
  if (state === 'proposing') {
    return <LoadingIndicator text={`${persona?.name} 셰프님이 메뉴를 구상 중입니다...`} />;
  }
  if (state === 'generating') {
    return <LoadingIndicator text="선택하신 메뉴의 레시피를 만들고 있습니다..." />;
  }

  if (state === 'proposed' && proposals.length > 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">3. 메뉴 선택</h2>
        <p className="text-center text-gray-500 mb-6">{persona?.name} 셰프님이 3가지 메뉴를 제안했어요. 하나를 골라주세요!</p>
        <div className="space-y-4">
          {proposals.map((p, index) => (
            <div
              key={index}
              onClick={() => onSelectMenu(p.name)}
              className="p-4 border rounded-lg hover:bg-indigo-50 hover:shadow-md transition-all cursor-pointer"
            >
              <h3 className="font-bold text-lg text-indigo-700">{p.name}</h3>
              <p className="text-gray-600">{p.reason}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state === 'recipe' && recipe) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-bold text-gray-900 !mb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-800 !mt-8 !mb-3 flex items-center" {...props} />,
            hr: ({node, ...props}) => <hr className="!my-6" {...props} />,
            ul: ({node, ...props}) => <ul className="!my-2 space-y-1" {...props} />,
            ol: ({node, ...props}) => <ol className="!my-2 space-y-3" {...props} />,
            li: ({node, ...props}) => <li className="!my-1" {...props} />,
            p: ({node, ...props}) => <p className="text-gray-700" {...props} />,
            strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />,
          }}
        >
          {recipe}
        </ReactMarkdown>
      </div>
    );
  }

  return null;
};

export default RecipeDisplay;
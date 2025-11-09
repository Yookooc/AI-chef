
import React from 'react';
import type { PersonaKey } from '../types';
import { PERSONAS } from '../constants';

interface PersonaSelectorProps {
  selectedPersonaKey: PersonaKey | null;
  onSelectPersona: (key: PersonaKey) => void;
  disabled: boolean;
}

const PersonaCard: React.FC<{ persona: typeof PERSONAS[string], isSelected: boolean, onSelect: () => void, disabled: boolean }> = ({ persona, isSelected, onSelect, disabled }) => {
  const baseClasses = "border-4 rounded-xl p-4 text-center cursor-pointer transition-all duration-300 transform";
  const selectedClasses = isSelected ? `${persona.color} scale-105 shadow-lg` : 'bg-white border-gray-200 hover:shadow-md hover:-translate-y-1';
  const disabledClasses = disabled && !isSelected ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <div
      className={`${baseClasses} ${selectedClasses} ${disabledClasses}`}
      onClick={() => !disabled && onSelect()}
    >
      <img
        src={persona.image}
        alt={persona.name}
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-sm"
      />
      <h3 className="text-xl font-bold text-gray-800">{persona.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{persona.description}</p>
    </div>
  );
};

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersonaKey, onSelectPersona, disabled }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">1. 셰프 선택</h2>
      <p className="text-center text-gray-500 mb-6">어떤 셰프의 레시피를 원하시나요?</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(PERSONAS).map((persona) => (
          <PersonaCard
            key={persona.key}
            persona={persona}
            isSelected={selectedPersonaKey === persona.key}
            onSelect={() => onSelectPersona(persona.key)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonaSelector;

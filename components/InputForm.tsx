import React from 'react';

interface UserInput {
  ingredients: string;
  situation: string;
  constraints: string;
}

interface InputFormProps {
  userInput: UserInput;
  onUserInput: (input: UserInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const LabeledTextarea: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder: string, disabled: boolean }> = ({ id, label, value, onChange, placeholder, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-md font-medium text-gray-200 mb-2">{label}</label>
    <textarea
      id={id}
      rows={3}
      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-500 placeholder-gray-400 disabled:cursor-not-allowed"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

const InputForm: React.FC<InputFormProps> = ({ userInput, onUserInput, onSubmit, isLoading, disabled }) => {
  const handleInputChange = (field: keyof UserInput, value: string) => {
    onUserInput({ ...userInput, [field]: value });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-1 text-white">2. 재료와 상황 입력</h2>
      <p className="text-center text-gray-300 mb-6">셰프에게 자세히 알려줄수록 더 좋은 메뉴를 추천해줘요!</p>
      <div className="space-y-4">
        <LabeledTextarea
          id="ingredients"
          label="✅ 가지고 있는 재료"
          value={userInput.ingredients}
          onChange={(e) => handleInputChange('ingredients', e.target.value)}
          placeholder="예) 돼지고기 목살, 양파, 남은 깻잎"
          disabled={disabled || isLoading}
        />
        <LabeledTextarea
          id="situation"
          label="😎 지금 기분이나 상황"
          value={userInput.situation}
          onChange={(e) => handleInputChange('situation', e.target.value)}
          placeholder="예) 스트레스 확 풀리는 매콤한 음식이 땡겨요!"
          disabled={disabled || isLoading}
        />
        <LabeledTextarea
          id="constraints"
          label="💡 기타 조건"
          value={userInput.constraints}
          onChange={(e) => handleInputChange('constraints', e.target.value)}
          placeholder="예) 저녁 식사, 2인분, 30분 안에 완성"
          disabled={disabled || isLoading}
        />
      </div>
      <div className="mt-6">
        <button
          onClick={onSubmit}
          disabled={isLoading || disabled}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              추천 메뉴 찾는 중...
            </>
          ) : (
            '레시피 추천받기'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
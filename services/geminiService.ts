import type { Persona, MenuProposal } from '../types';

// Helper function to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// The original API call function is no longer needed for the mock version.
/*
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
*/

export const getMenuProposals = async (
  persona: Persona,
  ingredients: string,
  situation: string,
  constraints: string
): Promise<MenuProposal[]> => {
  console.log(" MOCK MODE : Returning sample menu proposals.");
  await sleep(1500); // Simulate API loading time

  // Return hardcoded proposals based on the persona for a more dynamic feel.
  switch (persona.key) {
    case 'kim':
      return [
        { name: '돼지고기 김치찜', reason: '남은 목살과 김치만 있으면 밥도둑이 뚝딱! 스트레스가 확 풀릴 거예요.' },
        { name: '깻잎 제육볶음', reason: '향긋한 깻잎과 매콤한 제육볶음으로 기분 좋은 저녁을 만들어봐요.' },
        { name: '두부조림', reason: '유통기한 임박한 두부를 맛있게 구제할 수 있는 최고의 집반찬이죠.' },
      ];
    case 'edward':
      return [
        { name: '포크 스테이크와 양파 콩피', reason: '목살을 활용한 레스토랑급 스테이크로 당신의 성공적인 발표를 축하하세요.' },
        { name: '깻잎 페스토를 곁들인 파스타', reason: '향긋한 깻잎을 이탈리안 페스토로 재해석한 창의적인 요리입니다.' },
        { name: '수비드 스타일 두부 스테이크', reason: '두부의 부드러움을 극대화하여 품격있는 저녁 식사를 완성합니다.' },
      ];
    case 'yolo':
      return [
        { name: '목살 듬뿍 때려넣은 짜글이', reason: '이거 하나면 밥 두공기 순삭! 스트레스? 그냥 녹아버릴걸?' },
        { name: '깻잎쌈 참치마요덮밥', reason: '남은 깻잎으로 만드는 초간단 JMT 덮밥, 인스타 각 바로 나온다~' },
        { name: '순두부 열라면', reason: '기분 꿀꿀할 땐 이게 직빵! 냉장고 남은 재료 다 넣고 끓여!' },
      ];
    default:
      return [
        { name: '샘플 제육볶음', reason: '이것은 샘플 데이터입니다. 맛있어 보이죠?' },
        { name: '샘플 두부김치', reason: 'API 키가 없어도 앱을 테스트할 수 있어요.' },
        { name: '샘플 깻잎전', reason: '나중에 진짜 API를 연결해보세요!' },
      ];
  }
};


export const getDetailedRecipe = async (
  persona: Persona,
  ingredients: string,
  situation: string,
  constraints: string,
  selectedMenuName: string
): Promise<string> => {
  console.log(" MOCK MODE : Returning sample recipe for:", selectedMenuName);
  await sleep(2000); // Simulate API loading time

  // Return a hardcoded detailed recipe string in Markdown.
  return `
## ${selectedMenuName} (샘플 레시피)
### 🧑‍🍳 ${persona.name} 셰프가 자신있게 추천하는 오늘의 요리!
---
*   **🤔 추천 이유:** 중요한 발표를 마치고 기분 좋게 자축하기에 딱 맞는, 스트레스 확 풀리는 맛있는 요리입니다!
*   **🕒 예상 소요 시간:** 30분
*   **🔥 난이도:** ★★☆ (중)
*   **🥂 어울리는 주류:** 시원한 맥주나 막걸리
---
### 📋 재료 준비
*   **핵심 재료:** 돼지고기 목살 300g, 남은 깻잎, 양파 반 개, 두부 (사용자 입력 기반)
*   **양념 및 기타:** 고추장, 고춧가루, 간장, 설탕, 다진 마늘, 참기름
---
### 🍳 요리 순서
1.  돼지고기는 먹기 좋게 썰고, 양파는 채썰어주세요. 깻잎도 깨끗이 씻어 준비합니다.
2.  양념장(고추장 2스푼, 고춧가루 1스푼, 간장 1스푼, 설탕 1스푼, 다진 마늘 1스푼)을 만들어 돼지고기와 양파를 재워둡니다.
3.  팬에 기름을 두르고 재워둔 고기를 볶아주세요. 고기가 거의 익으면 두부를 넣고 함께 볶습니다.
4.  마지막으로 깻잎을 넣고 참기름을 살짝 둘러 마무리하면 완성!
---
### 💡 ${persona.name}의 꿀팁!
이 레시피는 샘플 데이터입니다. 실제 API를 연결하면 페르소나의 개성이 담긴 멋진 꿀팁을 볼 수 있을 거예요!
  `;
};

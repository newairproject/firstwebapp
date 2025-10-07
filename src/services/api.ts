import type { ApiResponse } from '../types';

// Mock 응답 데이터
const mockResponses = [
  "안녕하세요! 어떻게 도와드릴까요?",
  "좋은 질문이네요. 제가 분석해보겠습니다.",
  "흥미로운 내용입니다. 더 자세히 설명해드릴게요.",
  "이미지를 분석해보니 매우 흥미로운 내용이 포함되어 있네요.",
  "제공해주신 정보를 바탕으로 다음과 같이 답변드립니다.",
  "이 주제에 대해 더 깊이 있게 논의해보겠습니다.",
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendTextToGPT = async (
  text: string, 
  prompt: string
): Promise<ApiResponse> => {
  try {
    // 실제 API 호출을 시뮬레이션하는 지연
    await delay(1000 + Math.random() * 2000);
    
    // Mock 응답 생성
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const response = `프롬프트: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"\n\n입력하신 내용: "${text}"\n\n${randomResponse}`;
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: '응답을 생성하는 중 오류가 발생했습니다.',
    };
  }
};

export const sendImageToGPT = async (
  imageFile: File,
  prompt: string
): Promise<ApiResponse> => {
  try {
    // 실제 API 호출을 시뮬레이션하는 지연
    await delay(2000 + Math.random() * 3000);
    
    // 이미지 타입에 따른 Mock 응답
    const imageType = imageFile.type.split('/')[1];
    const response = `프롬프트: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"\n\n업로드하신 ${imageType} 이미지를 분석했습니다.\n\n이미지에서 다음과 같은 내용을 확인할 수 있습니다:\n- 파일 크기: ${(imageFile.size / 1024).toFixed(1)}KB\n- 파일 형식: ${imageFile.type}\n\n${mockResponses[Math.floor(Math.random() * mockResponses.length)]}`;
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: '이미지 분석 중 오류가 발생했습니다.',
    };
  }
};

// 실제 OpenAI API를 사용할 때를 위한 함수 (현재는 사용하지 않음)
export const sendToOpenAI = async (
  content: string,
  prompt: string,
  imageData?: string
): Promise<ApiResponse> => {
  // TODO: 실제 OpenAI API 연동
  console.log('실제 API 연동 예정:', { content, prompt, imageData });
  
  // 현재는 Mock 데이터 반환
  if (imageData) {
    return sendImageToGPT(new File([], 'mock'), prompt);
  } else {
    return sendTextToGPT(content, prompt);
  }
};
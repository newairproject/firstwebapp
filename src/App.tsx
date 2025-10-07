import { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { PromptManager } from './components/PromptManager';
import type { Message, Prompt, Conversation } from './types';
import {
  getConversations,
  getCurrentConversationId,
  createNewConversation,
  updateConversation,
  getPrompts,
  addPrompt
} from './utils/storage';

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isPromptManagerOpen, setIsPromptManagerOpen] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    // 기본 프롬프트 생성 (처음 실행 시)
    const existingPrompts = getPrompts();
    if (existingPrompts.length === 0) {
      addPrompt({
        name: '일반 대화',
        content: '친근하고 도움이 되는 AI 어시스턴트로서 사용자의 질문에 답변해주세요.',
      });
      addPrompt({
        name: '이미지 분석',
        content: '업로드된 이미지를 자세히 분석하고 설명해주세요. 이미지에서 보이는 객체, 색상, 구성, 분위기 등을 포함해서 설명해주세요.',
      });
      addPrompt({
        name: '번역',
        content: '제공된 텍스트를 한국어로 번역해주세요. 자연스럽고 정확한 번역을 제공해주세요.',
      });
    }

    // 대화 불러오기
    const storedConversations = getConversations();
    setConversations(storedConversations);

    // 현재 대화 설정
    const currentId = getCurrentConversationId();
    const current = storedConversations.find(c => c.id === currentId);
    
    if (current) {
      setCurrentConversation(current);
    } else if (storedConversations.length > 0) {
      setCurrentConversation(storedConversations[0]);
    } else {
      // 새 대화 생성
      const newConv = createNewConversation();
      setConversations([newConv]);
      setCurrentConversation(newConv);
    }
  };

  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    if (!currentConversation) return;

    const newMessage: Message = {
      ...messageData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    const updatedConversation: Conversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      updatedAt: new Date(),
    };

    // 첫 번째 메시지인 경우 대화 제목 업데이트
    if (currentConversation.messages.length === 0 && messageData.sender === 'user') {
      updatedConversation.title = messageData.content.substring(0, 30) + (messageData.content.length > 30 ? '...' : '');
    }

    setCurrentConversation(updatedConversation);
    setConversations(conversations.map(c => 
      c.id === currentConversation.id ? updatedConversation : c
    ));

    // 로컬스토리지에 저장
    updateConversation(currentConversation.id, updatedConversation);
  };

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="h-screen bg-gray-50">
      <ChatInterface
        messages={currentConversation?.messages || []}
        onSendMessage={handleSendMessage}
        selectedPrompt={selectedPrompt}
        onOpenPromptManager={() => setIsPromptManagerOpen(true)}
      />

      <PromptManager
        isOpen={isPromptManagerOpen}
        onClose={() => setIsPromptManagerOpen(false)}
        onSelectPrompt={handleSelectPrompt}
      />
    </div>
  );
}

export default App;

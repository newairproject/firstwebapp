import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, FileText, Settings, MessageSquare } from 'lucide-react';
import type { Message, Prompt, InputType } from '../types';
import { sendTextToGPT, sendImageToGPT } from '../services/api';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  selectedPrompt: Prompt | null;
  onOpenPromptManager: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  selectedPrompt,
  onOpenPromptManager,
}) => {
  const [inputType, setInputType] = useState<InputType>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setInputType('image');
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!selectedPrompt) {
      alert('프롬프트를 먼저 선택해주세요.');
      return;
    }

    if (inputType === 'text' && !textInput.trim()) {
      return;
    }

    if (inputType === 'image' && !selectedFile) {
      return;
    }

    setIsLoading(true);

    try {
      if (inputType === 'text') {
        // 사용자 메시지 추가
        const userMessage: Omit<Message, 'id' | 'timestamp'> = {
          content: textInput,
          type: 'text',
          sender: 'user',
          promptUsed: selectedPrompt.name,
        };
        onSendMessage(userMessage);

        // API 호출
        const response = await sendTextToGPT(textInput, selectedPrompt.content);
        
        if (response.success && response.data) {
          const assistantMessage: Omit<Message, 'id' | 'timestamp'> = {
            content: response.data,
            type: 'text',
            sender: 'assistant',
          };
          onSendMessage(assistantMessage);
        } else {
          const errorMessage: Omit<Message, 'id' | 'timestamp'> = {
            content: response.error || '오류가 발생했습니다.',
            type: 'text',
            sender: 'assistant',
          };
          onSendMessage(errorMessage);
        }

        setTextInput('');
      } else if (inputType === 'image' && selectedFile) {
        // 이미지 메시지 추가
        const userMessage: Omit<Message, 'id' | 'timestamp'> = {
          content: `이미지 업로드: ${selectedFile.name}`,
          type: 'image',
          sender: 'user',
          promptUsed: selectedPrompt.name,
          imageUrl: previewUrl || '',
        };
        onSendMessage(userMessage);

        // API 호출
        const response = await sendImageToGPT(selectedFile, selectedPrompt.content);
        
        if (response.success && response.data) {
          const assistantMessage: Omit<Message, 'id' | 'timestamp'> = {
            content: response.data,
            type: 'text',
            sender: 'assistant',
          };
          onSendMessage(assistantMessage);
        } else {
          const errorMessage: Omit<Message, 'id' | 'timestamp'> = {
            content: response.error || '이미지 분석 중 오류가 발생했습니다.',
            type: 'text',
            sender: 'assistant',
          };
          onSendMessage(errorMessage);
        }

        clearFileSelection();
        setInputType('text');
      }
    } catch (error) {
      console.error('Message send error:', error);
      const errorMessage: Omit<Message, 'id' | 'timestamp'> = {
        content: '메시지 전송 중 오류가 발생했습니다.',
        type: 'text',
        sender: 'assistant',
      };
      onSendMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-blue-500" size={24} />
            <div>
              <h1 className="text-lg font-semibold">GPT 채팅</h1>
              <p className="text-sm text-gray-500">
                {selectedPrompt ? `프롬프트: ${selectedPrompt.name}` : '프롬프트를 선택해주세요'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPromptManager}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            <Settings size={16} />
            프롬프트 관리
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p>새로운 대화를 시작해보세요!</p>
            <p className="text-sm mt-2">프롬프트를 선택하고 메시지를 입력하거나 이미지를 업로드하세요.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl p-4 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.type === 'image' && message.imageUrl && (
                <div className="mb-2">
                  <img
                    src={message.imageUrl}
                    alt="업로드된 이미지"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.promptUsed && (
                <p className="text-xs mt-2 opacity-75">
                  프롬프트: {message.promptUsed}
                </p>
              )}
              <p className="text-xs mt-1 opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-gray-600">응답 생성 중...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t p-4 bg-white">
        {/* 입력 타입 선택 */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => {
              setInputType('text');
              clearFileSelection();
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              inputType === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FileText size={16} />
            텍스트
          </button>
          <button
            onClick={() => {
              setInputType('image');
              fileInputRef.current?.click();
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              inputType === 'image'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Image size={16} />
            이미지
          </button>
        </div>

        {/* 이미지 미리보기 */}
        {previewUrl && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">선택된 이미지:</span>
              <button
                onClick={clearFileSelection}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                제거
              </button>
            </div>
            <img
              src={previewUrl}
              alt="미리보기"
              className="max-w-32 h-auto rounded-lg"
            />
          </div>
        )}

        {/* 입력 필드 */}
        <div className="flex gap-2">
          {inputType === 'text' ? (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedPrompt ? "메시지를 입력하세요..." : "먼저 프롬프트를 선택해주세요"}
              className="flex-1 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={!selectedPrompt || isLoading}
            />
          ) : (
            <div className="flex-1 p-3 border rounded-lg bg-gray-50">
              <p className="text-gray-500">
                {selectedFile ? `선택된 파일: ${selectedFile.name}` : '이미지 버튼을 클릭해서 파일을 선택하세요'}
              </p>
            </div>
          )}
          
          <button
            onClick={handleSend}
            disabled={
              !selectedPrompt ||
              isLoading ||
              (inputType === 'text' && !textInput.trim()) ||
              (inputType === 'image' && !selectedFile)
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
            전송
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};
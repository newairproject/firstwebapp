import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import type { Prompt } from '../types';
import { getPrompts, addPrompt, updatePrompt, deletePrompt } from '../utils/storage';

interface PromptManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: Prompt) => void;
}

export const PromptManager: React.FC<PromptManagerProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '' });
  const [editForm, setEditForm] = useState({ name: '', content: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPrompts();
    }
  }, [isOpen]);

  const loadPrompts = () => {
    const storedPrompts = getPrompts();
    setPrompts(storedPrompts);
  };

  const handleAddPrompt = () => {
    if (newPrompt.name.trim() && newPrompt.content.trim()) {
      const created = addPrompt(newPrompt);
      setPrompts([...prompts, created]);
      setNewPrompt({ name: '', content: '' });
      setShowAddForm(false);
    }
  };

  const handleStartEdit = (prompt: Prompt) => {
    setEditingId(prompt.id);
    setEditForm({ name: prompt.name, content: prompt.content });
  };

  const handleSaveEdit = () => {
    if (editingId && editForm.name.trim() && editForm.content.trim()) {
      updatePrompt(editingId, editForm);
      setPrompts(prompts.map(p => 
        p.id === editingId 
          ? { ...p, ...editForm, updatedAt: new Date() }
          : p
      ));
      setEditingId(null);
    }
  };

  const handleDeletePrompt = (id: string) => {
    if (confirm('이 프롬프트를 삭제하시겠습니까?')) {
      deletePrompt(id);
      setPrompts(prompts.filter(p => p.id !== id));
    }
  };

  const handleSelectPrompt = (prompt: Prompt) => {
    onSelectPrompt(prompt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">프롬프트 관리</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* 프롬프트 목록 */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus size={16} />
                새 프롬프트 추가
              </button>
            </div>

            <div className="space-y-2 px-4">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectPrompt(prompt)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{prompt.name}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(prompt);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePrompt(prompt.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {prompt.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 편집 영역 */}
          <div className="flex-1 p-6">
            {showAddForm && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">새 프롬프트 추가</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">이름</label>
                  <input
                    type="text"
                    value={newPrompt.name}
                    onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="프롬프트 이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">내용</label>
                  <textarea
                    value={newPrompt.content}
                    onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                    className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="프롬프트 내용을 입력하세요"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddPrompt}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Save size={16} />
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewPrompt({ name: '', content: '' });
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {editingId && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">프롬프트 편집</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">이름</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">내용</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Save size={16} />
                    저장
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {!showAddForm && !editingId && (
              <div className="flex items-center justify-center h-full text-gray-500">
                프롬프트를 선택하거나 새로 추가해보세요
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
'use client'
import { createContext, useContext, useState, ReactNode } from 'react';

type ModelType = 'deepseek-v3-241226' | 'deepseek-r1-250120' | 'doubao-1.5-lite-32k-250115';

type ModelContextType = {
  currentModel: ModelType;
  setModel: (model: ModelType) => void;
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [currentModel, setCurrentModel] = useState<ModelType>('doubao-1.5-lite-32k-250115');

  const setModel = (model: ModelType) => {
    console.log('[ModelContext] 切换模型，当前模型:', currentModel, '新模型:', model);
    setCurrentModel(model);
    document.cookie = `currentModel=${model}; path=/;`;
  };

  return (
    <ModelContext.Provider value={{ currentModel, setModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Document {
  id: string;
  name: string;
  text: string;
  uploadedAt: Date;
  fileType: string;
}

export interface EnhancementResult {
  id: string;
  documentId: string;
  originalText: string;
  enhancedText: string;
  summary?: string;
  keyPoints?: string[];
  enhancementType: 'enhance' | 'summarize' | 'key-points';
  timestamp: Date;
}

interface DocumentStore {
  documents: Document[];
  currentDocument: Document | null;
  enhancementHistory: EnhancementResult[];
  currentEnhancement: EnhancementResult | null;
  isProcessing: boolean;
  error: string | null;
  
  addDocument: (document: Document) => void;
  setCurrentDocument: (document: Document | null) => void;
  addEnhancementResult: (result: EnhancementResult) => void;
  setCurrentEnhancement: (result: EnhancementResult | null) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  deleteDocument: (id: string) => void;
  deleteEnhancement: (id: string) => void;
  clearAllDocuments: () => void;
  getDocumentEnhancements: (documentId: string) => EnhancementResult[];
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: [],
      currentDocument: null,
      enhancementHistory: [],
      currentEnhancement: null,
      isProcessing: false,
      error: null,
      
      addDocument: (document) => set((state) => ({
        documents: [...state.documents, document],
        currentDocument: document,
      })),
      
      setCurrentDocument: (document) => set({ currentDocument: document }),
      
      addEnhancementResult: (result) => set((state) => ({
        enhancementHistory: [...state.enhancementHistory, result],
        currentEnhancement: result,
      })),
      
      setCurrentEnhancement: (result) => set({ currentEnhancement: result }),
      
      setProcessing: (isProcessing) => set({ isProcessing }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter(doc => doc.id !== id),
        currentDocument: state.currentDocument?.id === id ? null : state.currentDocument,
        enhancementHistory: state.enhancementHistory.filter(enh => enh.documentId !== id),
        currentEnhancement: state.currentEnhancement?.documentId === id ? null : state.currentEnhancement,
      })),
      
      deleteEnhancement: (id) => set((state) => ({
        enhancementHistory: state.enhancementHistory.filter(enh => enh.id !== id),
        currentEnhancement: state.currentEnhancement?.id === id ? null : state.currentEnhancement,
      })),
      
      clearAllDocuments: () => set({
        documents: [],
        currentDocument: null,
        enhancementHistory: [],
        currentEnhancement: null,
      }),

      getDocumentEnhancements: (documentId) => {
        const state = get();
        return state.enhancementHistory.filter(enh => enh.documentId === documentId);
      },
    }),
    {
      name: 'document-storage',
    }
  )
);

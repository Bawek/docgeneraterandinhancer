'use client';

import { useState } from 'react';
import { useDocumentStore } from '@/lib/store';
import DocumentUpload from '@/components/DocumentUpload';
import EnhancementOptions from '@/components/EnhancementOptions';
import ResultDisplay from '@/components/ResultDisplay';
import AIChat from '@/components/AIChat';
import DocumentHistory from '@/components/DocumentHistory';
import DocumentComparison from '@/components/DocumentComparison';
import { AlertCircle, Loader2, Sparkles, FileText, Brain, Zap, MessageSquare, FileText as FileIcon, History, GitCompare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchWithRetry, validateTextLength } from '@/lib/api';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Toaster from '@/components/Toaster';
import { useToastStore } from '@/lib/toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'enhance' | 'chat' | 'history' | 'compare'>('enhance');
  const { currentDocument, currentEnhancement, isProcessing, error, clearError, addEnhancementResult, setProcessing, setError } = useDocumentStore();
  const { addToast } = useToastStore();

  const handleEnhance = async (type: 'enhance' | 'summarize' | 'key-points') => {
    if (!currentDocument) return;

    const validation = validateTextLength(currentDocument.text);
    if (!validation.valid) {
      setError(validation.error || 'Invalid text');
      return;
    }

    setProcessing(true);
    clearError();

    try {
      const response = await fetchWithRetry('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentDocument.text, options: { type } }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance document');
      }

      const data = await response.json();
      addEnhancementResult({
        id: Date.now().toString(),
        documentId: currentDocument.id,
        originalText: currentDocument.text,
        enhancedText: data.enhancedText,
        summary: data.summary,
        keyPoints: data.keyPoints,
        enhancementType: type,
        timestamp: new Date(),
      });
      addToast('Document enhanced successfully', 'success');
    } catch (error) {
      setError('Failed to enhance document. Please try again.');
      addToast('Failed to enhance document', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const features = [
    { icon: Sparkles, title: 'AI Enhancement', description: 'Improve clarity and professionalism' },
    { icon: FileText, title: 'Smart Summarization', description: 'Get concise document summaries' },
    { icon: Brain, title: 'Key Extraction', description: 'Identify important points' },
    { icon: Zap, title: 'Fast Processing', description: 'Quick and efficient analysis' },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-950 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium mb-6 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              DocuMind AI
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Transform your documents with intelligent AI-powered enhancement, summarization, and analysis
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{feature.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
                <CardContent className="p-4 flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <DocumentUpload />
              {currentDocument && !currentEnhancement && (
                <EnhancementOptions onEnhance={handleEnhance} isProcessing={isProcessing} />
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              <div className="flex gap-2 mb-4 flex-wrap">
                <Button
                  onClick={() => setActiveTab('enhance')}
                  variant={activeTab === 'enhance' ? 'default' : 'outline'}
                  className="flex-1 min-w-[100px]"
                >
                  <FileIcon className="w-4 h-4 mr-2" />
                  Tools
                </Button>
                <Button
                  onClick={() => setActiveTab('chat')}
                  variant={activeTab === 'chat' ? 'default' : 'outline'}
                  className="flex-1 min-w-[100px]"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button
                  onClick={() => setActiveTab('history')}
                  variant={activeTab === 'history' ? 'default' : 'outline'}
                  className="flex-1 min-w-[100px]"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
                <Button
                  onClick={() => setActiveTab('compare')}
                  variant={activeTab === 'compare' ? 'default' : 'outline'}
                  className="flex-1 min-w-[100px]"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </div>

              {activeTab === 'enhance' ? (
                <>
                  {isProcessing && (
                    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                      <CardContent className="p-12 flex flex-col items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 mb-4" />
                        </motion.div>
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Processing your document...</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Our AI is analyzing and enhancing your content</p>
                      </CardContent>
                    </Card>
                  )}

                  {currentEnhancement && <ResultDisplay result={currentEnhancement} />}
                </>
              ) : activeTab === 'chat' ? (
                <AIChat />
              ) : activeTab === 'history' ? (
                <DocumentHistory />
              ) : (
                <DocumentComparison />
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Toaster />
    </ErrorBoundary>
  );
}

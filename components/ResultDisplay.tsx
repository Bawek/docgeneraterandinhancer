'use client';

import { Download, Copy, Check, Trash2, Sparkles, FileText, List, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { EnhancementResult } from '@/lib/store';
import { useState } from 'react';
import { useDocumentStore } from '@/lib/store';
import { useToastStore } from '@/lib/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResultDisplayProps {
  result: EnhancementResult;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('enhanced');
  const { clearAllDocuments, deleteEnhancement } = useDocumentStore();
  const { addToast } = useToastStore();

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Copied to clipboard', 'success');
  };

  const handleDownload = () => {
    const blob = new Blob([result.enhancedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Document downloaded', 'success');
  };

  const handleClear = () => {
    deleteEnhancement(result.id);
    addToast('Enhancement cleared', 'info');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Sparkles className="w-5 h-5" />
            Enhancement Complete
          </CardTitle>
          <CardDescription>
            Processed on {result.timestamp.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="enhanced" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Enhanced
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2" disabled={!result.summary}>
                <FileText className="w-4 h-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="keypoints" className="flex items-center gap-2" disabled={!result.keyPoints || result.keyPoints.length === 0}>
                <List className="w-4 h-4" />
                Key Points
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="enhanced" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Enhanced Text
                    </h3>
                    <Button
                      onClick={() => handleCopy(result.enhancedText)}
                      variant="ghost"
                      size="sm"
                      className="h-8"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {result.enhancedText}
                    </p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="summary" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Summary
                    </h3>
                    <Button
                      onClick={() => result.summary && handleCopy(result.summary)}
                      variant="ghost"
                      size="sm"
                      className="h-8"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="keypoints" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <List className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Key Points
                    </h3>
                    <Button
                      onClick={() => result.keyPoints && handleCopy(result.keyPoints.join('\n'))}
                      variant="ghost"
                      size="sm"
                      className="h-8"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <ul className="space-y-3">
                    {result.keyPoints?.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {point}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              size="sm"
              type="button"
              className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button 
              onClick={handleClear} 
              variant="outline" 
              size="sm"
              type="button"
              className="flex-1 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

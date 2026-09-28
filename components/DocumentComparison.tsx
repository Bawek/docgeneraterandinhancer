'use client';

import { useState } from 'react';
import { useDocumentStore } from '@/lib/store';
import { GitCompare, ArrowRight, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';

export default function DocumentComparison() {
  const { enhancementHistory, documents } = useDocumentStore();
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedEnhancements(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : prev.length < 2 ? [...prev, id]
        : prev
    );
  };

  const canCompare = selectedEnhancements.length === 2;

  const getEnhancementById = (id: string) => {
    return enhancementHistory.find(e => e.id === id);
  };

  const getDocumentById = (id: string) => {
    return documents.find(d => d.id === id);
  };

  const selectedEnhancement1 = getEnhancementById(selectedEnhancements[0]);
  const selectedEnhancement2 = getEnhancementById(selectedEnhancements[1]);

  return (
    <Card className="w-full border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
          <GitCompare className="w-5 h-5" />
          Document Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Select 2 enhancements to compare their results
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {enhancementHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <GitCompare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No enhancements to compare</p>
            </div>
          ) : (
            enhancementHistory.map((enh, index) => {
              const doc = getDocumentById(enh.documentId);
              const isSelected = selectedEnhancements.includes(enh.id);
              
              return (
                <motion.div
                  key={enh.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => toggleSelection(enh.id)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-purple-100 dark:bg-purple-950/30 border-purple-500 dark:border-purple-500' 
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }
                  `}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {isSelected ? (
                      <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 capitalize text-sm">
                      {enh.enhancementType}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {doc?.name || 'Unknown document'}
                    </p>
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(enh.timestamp).toLocaleDateString()}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {canCompare && selectedEnhancement1 && selectedEnhancement2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-4 border-t border-purple-200 dark:border-purple-800"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2 capitalize">
                  {selectedEnhancement1.enhancementType}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {new Date(selectedEnhancement1.timestamp).toLocaleString()}
                </div>
                <div className="max-h-32 overflow-y-auto text-sm text-slate-700 dark:text-slate-300 custom-scrollbar">
                  {selectedEnhancement1.enhancedText.substring(0, 300)}...
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2 capitalize">
                  {selectedEnhancement2.enhancementType}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {new Date(selectedEnhancement2.timestamp).toLocaleString()}
                </div>
                <div className="max-h-32 overflow-y-auto text-sm text-slate-700 dark:text-slate-300 custom-scrollbar">
                  {selectedEnhancement2.enhancedText.substring(0, 300)}...
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm">Compare the two enhancement results above</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
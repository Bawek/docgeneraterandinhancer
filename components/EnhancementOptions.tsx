'use client';

import { Sparkles, FileText, List, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';

interface EnhancementOptionsProps {
  onEnhance: (type: 'enhance' | 'summarize' | 'key-points') => void;
  isProcessing: boolean;
}

const options = [
  {
    type: 'enhance' as const,
    icon: Sparkles,
    title: 'Enhance Text',
    description: 'Improve clarity, readability, and professionalism',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
  },
  {
    type: 'summarize' as const,
    icon: FileText,
    title: 'Summarize',
    description: 'Generate a concise summary of the document',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
  },
  {
    type: 'key-points' as const,
    icon: List,
    title: 'Extract Key Points',
    description: 'Identify and list the most important points',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
  },
];

export default function EnhancementOptions({ onEnhance, isProcessing }: EnhancementOptionsProps) {
  return (
    <Card className="w-full border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          AI Enhancement Options
        </CardTitle>
        <CardDescription>
          Choose how you want to process your document with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option, index) => (
          <motion.div
            key={option.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Button
              onClick={() => onEnhance(option.type)}
              disabled={isProcessing}
              className={`
                w-full justify-start h-auto py-4 px-4
                bg-gradient-to-r ${option.bgGradient}
                hover:from-slate-100 hover:to-slate-200 
                dark:hover:from-slate-700 dark:hover:to-slate-600
                border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600
                transition-all duration-200
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              variant="outline"
              type="button"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${option.gradient} mr-3`}>
                <option.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {option.title}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {option.description}
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

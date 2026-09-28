'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { useDocumentStore } from '@/lib/store';
import { fetchWithRetry } from '@/lib/api';
import { useToastStore } from '@/lib/toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { addDocument, setError, currentDocument } = useDocumentStore();
  const { addToast } = useToastStore();

  const handleFile = useCallback(async (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError('Only PDF, DOCX, and TXT files are supported');
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 10MB limit');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetchWithRetry('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse document');
      }

      const { text } = await response.json();

      addDocument({
        id: Date.now().toString(),
        name: file.name,
        text,
        uploadedAt: new Date(),
        fileType: file.type,
      });
      addToast('Document uploaded successfully', 'success');
    } catch (error) {
      setError('Failed to process document. Please try again.');
      addToast('Failed to process document', 'error');
    } finally {
      setIsUploading(false);
    }
  }, [addDocument, setError, addToast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  if (currentDocument) {
    return (
      <Card className="w-full border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check className="w-5 h-5" />
            Document Uploaded
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{currentDocument.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {currentDocument.text.length.toLocaleString()} characters
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Uploaded {currentDocument.uploadedAt.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
            <p className="line-clamp-3">{currentDocument.text.substring(0, 200)}...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 mb-4" />
                </motion.div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Processing document...</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Extracting text and preparing for analysis</p>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                <AnimatePresence mode="wait">
                  {isDragging ? (
                    <motion.div
                      key="dragging"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="space-y-4"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Upload className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">Drop your document here</h3>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                          Upload Document
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Drag and drop your file here, or click to browse
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">PDF</span>
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">DOCX</span>
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">TXT</span>
                          <span className="ml-2">Max 10MB</span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-input"
                        disabled={isUploading}
                      />
                      <label htmlFor="file-input">
                        <Button 
                          type="button" 
                          disabled={isUploading}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                        >
                          Select File
                        </Button>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

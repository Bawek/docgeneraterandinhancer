'use client';

import { useDocumentStore } from '@/lib/store';
import { History, FileText, Clock, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DocumentHistory() {
  const { documents, enhancementHistory, setCurrentDocument, setCurrentEnhancement, deleteDocument, deleteEnhancement } = useDocumentStore();
  const [view, setView] = useState<'documents' | 'enhancements'>('documents');

  const handleSelectDocument = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) setCurrentDocument(doc);
  };

  const handleSelectEnhancement = (enhId: string) => {
    const enh = enhancementHistory.find(e => e.id === enhId);
    if (enh) setCurrentEnhancement(enh);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Card className="w-full border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Document History
        </CardTitle>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => setView('documents')}
            variant={view === 'documents' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            Documents ({documents.length})
          </Button>
          <Button
            onClick={() => setView('enhancements')}
            variant={view === 'enhancements' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            <History className="w-4 h-4 mr-2" />
            Enhancements ({enhancementHistory.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'documents' ? (
          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleSelectDocument(doc.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteDocument(doc.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {enhancementHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No enhancements yet</p>
              </div>
            ) : (
              enhancementHistory.map((enh, index) => {
                const doc = documents.find(d => d.id === enh.documentId);
                return (
                  <motion.div
                    key={enh.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <History className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">{enh.enhancementType}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {doc?.name || 'Unknown document'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(enh.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleSelectEnhancement(enh.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteEnhancement(enh.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
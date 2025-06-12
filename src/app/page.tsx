'use client';

import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

type SummaryType = 
  | 'concise'
  | 'bullet'
  | 'eli5'
  | 'executive'
  | 'detailed'
  | 'proscons'
  | 'facts';

interface SavedSummary {
  id: string;
  url: string;
  summary: string;
  type: SummaryType;
  timestamp: number;
  title: string;
}

const summaryOptions = [
  { id: 'concise', label: 'Concise Paragraph', description: 'A single, clear summary paragraph of the article.' },
  { id: 'bullet', label: 'Bullet Points', description: 'A list of 5–7 key takeaways.' },
  { id: 'eli5', label: "Explain Like I'm 5 (ELI5)", description: 'Simplified, beginner-friendly version — good for all audiences.' },
  { id: 'executive', label: 'Executive Summary', description: 'High-level insights for busy professionals.' },
  { id: 'detailed', label: 'Detailed Breakdown', description: 'A multi-paragraph structured summary: introduction, body, conclusion.' },
  { id: 'proscons', label: 'Pros & Cons', description: 'For reviews or opinion articles, show advantages/disadvantages of the article.' },
  { id: 'facts', label: 'Key Facts & Statistics', description: 'Only extract factual data or stats.' },
] as const;

export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<SummaryType>('concise');
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Load saved summaries from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedSummaries');
    if (saved) {
      setSavedSummaries(JSON.parse(saved));
    }
  }, []);

  // Save summaries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedSummaries', JSON.stringify(savedSummaries));
  }, [savedSummaries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, summaryType: selectedType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize article');
      }

      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const saveSummary = () => {
    if (!summary) return;

    const newSummary: SavedSummary = {
      id: Date.now().toString(),
      url,
      summary,
      type: selectedType,
      timestamp: Date.now(),
      title: url.split('/').pop() || 'Untitled Summary'
    };

    setSavedSummaries(prev => [newSummary, ...prev]);
    
    // Show toast notification
    setToast({ show: true, message: 'Summary saved successfully!' });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const deleteSummary = (id: string) => {
    setSavedSummaries(prev => prev.filter(summary => summary.id !== id));
  };

  const exportSummary = (summary: SavedSummary) => {
    const content = `Title: ${summary.title}
URL: ${summary.url}
Type: ${summaryOptions.find(opt => opt.id === summary.type)?.label}
Date: ${new Date(summary.timestamp).toLocaleString()}

${summary.summary}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <Hero />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Toast Notification */}
          {toast.show && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-fade-in-up">
              {toast.message}
            </div>
          )}

          {savedSummaries.length > 0 && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <ClockIcon className="w-5 h-5" />
                <span>{showHistory ? 'Hide History' : 'Show History'}</span>
                <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                  {savedSummaries.length}
                </span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter article URL"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summaryOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedType(option.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    selectedType === option.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? 'Summarizing...' : 'Summarize Article'}
              </button>
              {summary && (
                <button
                  type="button"
                  onClick={saveSummary}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors cursor-pointer"
                >
                  Save Summary
                </button>
              )}
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {summary && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Summary
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                {summary.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {showHistory && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Saved Summaries
              </h2>
              {savedSummaries.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No saved summaries yet.</p>
              ) : (
                <div className="space-y-4">
                  {savedSummaries.map((saved) => (
                    <div
                      key={saved.id}
                      className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {saved.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(saved.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => exportSummary(saved)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                            title="Export as TXT"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteSummary(saved.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {saved.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

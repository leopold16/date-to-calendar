import React, { useState } from 'react';
import { Calendar, Clock, Download, RefreshCw } from 'lucide-react';
import { parseInput } from './utils/parser';
import { generateICS } from './utils/icsGenerator';
import EventPreview from './components/EventPreview';

function App() {
  const [input, setInput] = useState('');
  const [event, setEvent] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError('');
    setEvent(null);
  };

  const handleGenerate = () => {
    try {
      setLoading(true);
      const parsedEvent = parseInput(input);
      setEvent(parsedEvent);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!event) return;
    generateICS(event);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Calendar className="h-10 w-10 text-indigo-600" />
            Calendar Event Generator
          </h1>
          <p className="text-gray-600">
            Convert natural language into calendar events. Try something like:
            "Team meeting next Tuesday at 2pm for 1 hour"
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your event
            </label>
            <textarea
              id="input"
              value={input}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[100px] text-gray-800"
              placeholder="Enter your event description..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!input.trim() || loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
              Generate Event
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {event && (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <EventPreview event={event} />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download .ics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
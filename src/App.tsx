/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  Users, 
  Plane, 
  Loader2, 
  ArrowRight, 
  Sparkles,
  Utensils,
  Camera,
  Compass,
  Lightbulb,
  Coins
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

const BUDGET_LEVELS = [
  "Budget", "Moderate", "Luxury"
];

export default function App() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('Moderate');
  const [travelType, setTravelType] = useState('Solo');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) return;

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        You are an AI Smart Travel Planner.
        Generate a comprehensive and inspiring travel plan for:
        - Destination: ${destination}
        - Travel Dates: ${startDate} to ${endDate}
        - Budget: ${budget}
        - Travel Type: ${travelType}

        Format the response in these EXACT sections using Markdown:

        # 🌍 Destination Overview
        Provide a captivating overview of the destination, its vibe, and why it's a great choice for a ${travelType} trip.

        # 📅 Travel Itinerary
        Generate a detailed day-by-day travel itinerary. 
        - Suggest specific tourist attractions, local food spots, and travel tips for each day. 
        - For each attraction, suggest the best time of day to visit (Morning, Afternoon, or Evening) to avoid crowds or get the best light.

        # 💰 Budget Estimate
        Estimate the total travel budget in USD. 
        - Break it down into: Transport (flights/local), Accommodation, Food, and Activities/Attractions.
        - Provide a total estimated range.

        # 🍜 Food Recommendations
        Suggest 3-5 specific local restaurants, cafes, or street food areas. Include what dish to order at each.

        # 💡 Travel Tips
        Provide essential travel tips including:
        - Local customs and etiquette.
        - Best way to get around (transportation).
        - Safety advice for ${travelType === 'Solo' ? 'solo travelers' : 'groups'}.
        - One "insider secret" for this destination.

        ${travelType === 'Solo' ? `
        # 🤝 Possible Travel Companions
        **Travel Companion Finder Feature Activated**
        Based on your destination and dates, here are other travelers looking for companions:

        1. **Companion A**
           - **Name:** [Invent a realistic name and origin, e.g., "Marco from Italy"]
           - **Dates:** [Dates within the user's range]
           - **Interests:** [2-3 interests, e.g., "Photography, Hiking"]
           - **Cost-Saving Suggestion:** [Specific suggestion, e.g., "Share a private car to the mountains to save $40 each."]

        2. **Companion B**
           - **Name:** [Invent a realistic name and origin]
           - **Dates:** [Dates within the user's range]
           - **Interests:** [2-3 interests]
           - **Cost-Saving Suggestion:** [Specific suggestion, e.g., "Split a 2-bedroom Airbnb in the city center."]

        *Note: These are simulated matches based on current travel trends for ${destination}.*
        ` : ''}

        Keep the output clear, professional, and well-structured with bullet points and bold text where appropriate.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setPlan(response.text || "No plan generated.");
    } catch (err) {
      console.error(err);
      setError("Failed to generate travel plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans text-[#1a1a1a] pb-20">
      {/* Hero Section */}
      <header className="pt-16 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4 border border-emerald-100">
            <Sparkles className="w-3 h-3" />
            AI Smart Travel Planner
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-4 text-[#1a1a1a]">
            VoyageAI
          </h1>
          <p className="text-lg text-stone-500 max-w-xl mx-auto font-light">
            Your intelligent travel concierge. Find the perfect itinerary and connect with fellow solo travelers.
          </p>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-3xl p-8 shadow-sm mb-12"
        >
          <form onSubmit={generatePlan} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Japan"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <Wallet className="w-3 h-3" /> Budget
              </label>
              <div className="flex gap-2">
                {BUDGET_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setBudget(level)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      budget === level 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <Users className="w-3 h-3" /> Travel Type
              </label>
              <div className="flex gap-2">
                {["Solo", "Group"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTravelType(type)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      travelType === type 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-stone-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Crafting your journey...
                  </>
                ) : (
                  <>
                    Generate Itinerary
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl mb-8 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Result Section */}
        <AnimatePresence mode="wait">
          {plan && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="glass-card rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Plane className="w-32 h-32 rotate-12" />
              </div>

              <div className="markdown-body prose prose-stone max-w-none">
                <ReactMarkdown>{plan}</ReactMarkdown>
              </div>

              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => {
                      setPlan(null);
                      setDestination('');
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="px-6 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-all flex items-center gap-2 text-sm"
                  >
                    Plan another trip
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2.5 rounded-xl bg-[#1a1a1a] text-white font-medium hover:bg-stone-800 transition-all flex items-center gap-2 text-sm shadow-lg shadow-stone-200"
                  >
                    Download PDF
                  </button>
                </div>

                <div className="pt-8 border-t border-stone-100 w-full flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-50 px-3 py-1.5 rounded-full">
                    <Camera className="w-3 h-3" /> Capture memories
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-50 px-3 py-1.5 rounded-full">
                    <Utensils className="w-3 h-3" /> Eat local
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-50 px-3 py-1.5 rounded-full">
                    <Compass className="w-3 h-3" /> Explore more
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {loading && !plan && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-2 border-dashed border-emerald-200 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Plane className="w-8 h-8 text-emerald-600 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-serif italic">Mapping out your adventure...</h3>
                <p className="text-stone-400 text-sm">Consulting local guides and hidden gems</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!plan && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale"
          >
            <div className="p-6 border border-dashed border-stone-300 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-stone-100 rounded-full"><Lightbulb className="w-5 h-5" /></div>
              <p className="text-xs font-medium uppercase tracking-widest">Smart Tips</p>
            </div>
            <div className="p-6 border border-dashed border-stone-300 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-stone-100 rounded-full"><Coins className="w-5 h-5" /></div>
              <p className="text-xs font-medium uppercase tracking-widest">Budgeting</p>
            </div>
            <div className="p-6 border border-dashed border-stone-300 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-stone-100 rounded-full"><Compass className="w-5 h-5" /></div>
              <p className="text-xs font-medium uppercase tracking-widest">Hidden Gems</p>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="mt-20 text-center text-stone-400 text-xs">
        <p>© 2026 VoyageAI. Powered by Gemini.</p>
      </footer>
    </div>
  );
}

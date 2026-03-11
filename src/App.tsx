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

const TRAVEL_TYPES = [
  "Solo", "Couple", "Family", "Friends", "Business", "Adventure"
];

const BUDGET_LEVELS = [
  "Budget", "Moderate", "Luxury"
];

export default function App() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [budget, setBudget] = useState('Moderate');
  const [travelType, setTravelType] = useState('Solo');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        You are an intelligent AI Travel Planner.
        Generate a structured travel plan for:
        - Destination: ${destination}
        - Duration: ${days} days
        - Budget: ${budget}
        - Travel Type: ${travelType}

        Include the following sections in Markdown format:

        ## 🌍 Destination Overview
        Give a short description of the place.

        ## 📅 Day-by-Day Itinerary
        Provide a simple plan for each day with activities. For each attraction or activity mentioned, suggest the best time of day to visit (morning, afternoon, or evening).

        ## 📍 Top Attractions
        List 4–5 famous places with short descriptions.

        ## 🍜 Local Food to Try
        Suggest 3 popular dishes.

        ## 💰 Budget Breakdown
        Estimate cost for transport, food, attractions, and others.

        ## ✨ Hidden Gems
        Suggest 2 lesser-known places.

        ## 💡 Travel Tips
        Provide useful travel advice.

        ## 💰 Budget Saving Tips
        Provide specific tips to reduce travel costs and stay within the ${budget} budget for this destination.

        ## 🌤 Weather Advice and Packing Suggestions
        Provide advice on the typical weather for this destination and suggest essential items to pack.

        Keep the output clear and well-structured with bullet points.
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
            AI-Powered Travel Planning
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-4">
            VoyageAI
          </h1>
          <p className="text-lg text-stone-500 max-w-xl mx-auto font-light">
            Your personal AI travel concierge. Tell us where you want to go, and we'll handle the rest.
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
                <Calendar className="w-3 h-3" /> Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(e.target.value)}
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
              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white appearance-none"
              >
                {TRAVEL_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
                <button
                  onClick={() => {
                    setPlan(null);
                    setDestination('');
                  }}
                  className="px-8 py-3 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-all flex items-center gap-2"
                >
                  Plan another trip
                </button>

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

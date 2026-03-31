"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { apiURL } from "@/src/constants";
import { toast } from "@/src/lib/toast";
import { useAuth } from "@/src/hooks/useAuth";

const INTERESTS = [
  'Technology', 'Research', 'Business', 'Design', 'Marketing', 
  'Science', 'Arts', 'Education', 'Health', 'Sports', 
  'Gaming', 'Photography', 'Writing', 'Music', 'Travel', 
  'Food', 'Fashion', 'Fitness', 'Other'
];

const REASONS = [
  { value: 'Networking', label: 'Professional Networking', icon: '🤝' },
  { value: 'Learning', label: 'Learning & Growth', icon: '📚' },
  { value: 'Sharing', label: 'Sharing Knowledge', icon: '💡' },
  { value: 'Research', label: 'Research & Development', icon: '🔬' },
  { value: 'Career', label: 'Career Development', icon: '🚀' },
  { value: 'Other', label: 'Other', icon: '✨' },
];

const OnboardingModal = ({ isOpen, onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    if (selectedInterests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiURL}/api/onboarding/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user._id,
          interests: selectedInterests,
          reason: selectedReason || "Other",
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Welcome! Your feed is ready 🎉");
        onComplete();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-100" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
              {step === 1 ? "👋 Welcome!" : step === 2 ? "🎯 Your Purpose" : "💫 Your Interests"}
            </h2>
            <div className="text-sm text-zinc-500">
              Step {step}/3
            </div>
          </div>
          <p className="text-zinc-400 mt-2" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
            {step === 1 && "Let's personalize your experience"}
            {step === 2 && "Why are you here? This helps us customize your feed"}
            {step === 3 && "Select topics you're interested in"}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="text-6xl">🎉</div>
              <h3 className="text-xl font-semibold text-zinc-200" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
                Welcome to the Community!
              </h3>
              <p className="text-zinc-400 leading-relaxed" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
                We're excited to have you here. Let's quickly set up your profile so you can see content that matters to you.
              </p>
            </div>
          )}

          {/* Step 2: Purpose */}
          {step === 2 && (
            <div className="space-y-4">
              {REASONS.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => setSelectedReason(reason.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedReason === reason.value
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reason.icon}</span>
                    <span className="text-zinc-200 font-medium" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
                      {reason.label}
                    </span>
                    {selectedReason === reason.value && (
                      <Check size={20} className="ml-auto text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div>
              <p className="text-sm text-zinc-500 mb-4">
                Selected: {selectedInterests.length} {selectedInterests.length === 1 ? "interest" : "interests"}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                      selectedInterests.includes(interest)
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : "border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400"
                    }`}
                    style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className="px-4 py-2 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {step > 1 && "← Back"}
          </button>

          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  s <= step ? "bg-blue-500" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !selectedReason}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading || selectedInterests.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? "Setting up..." : "Complete ✨"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;

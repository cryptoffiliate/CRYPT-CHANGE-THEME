"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { QUIZ_QUESTIONS, scoreExchanges, type ExchangeResult } from "@/lib/quiz-engine";
import { buildAffiliateUrl } from "@/lib/utils";

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  );
}

// ─── Single question view ─────────────────────────────────────────────────────
function QuestionStep({
  question,
  selected,
  onSelect,
  onNext,
  onBack,
  isFirst,
  isLast,
  stepNum,
  totalSteps,
}: {
  question: typeof QUIZ_QUESTIONS[0];
  selected: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  stepNum: number;
  totalSteps: number;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Step counter */}
      <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-2">
        Step {stepNum} of {totalSteps}
      </p>

      {/* Question */}
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
        {question.question}
      </h2>
      <p className="text-sm text-slate-400 mb-6">{question.subtitle}</p>

      {/* Options */}
      <div className="grid gap-3">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-150 ${
                isSelected
                  ? "border-brand-500 bg-brand-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-2xl flex-shrink-0">{opt.icon}</span>
              <span
                className={`font-medium text-sm ${
                  isSelected ? "text-brand-700" : "text-slate-700"
                }`}
              >
                {opt.label}
              </span>
              {isSelected && (
                <span className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {!isFirst && (
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ← Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!selected}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            selected
              ? "bg-brand-500 text-white hover:bg-brand-600 shadow-sm"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isLast ? "See my matches →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({
  result,
  rank,
}: {
  result: ExchangeResult;
  rank: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isTop = rank === 0;
  const url = buildAffiliateUrl(result.affiliateUrl, result.id, "quiz" as any);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        isTop
          ? "border-brand-200 bg-white shadow-md ring-1 ring-brand-100"
          : "border-slate-100 bg-white shadow-sm"
      }`}
    >
      {/* Top ribbon for #1 match */}
      {isTop && (
        <div className="bg-brand-500 text-white text-xs font-semibold px-4 py-1.5 rounded-t-2xl flex items-center gap-1.5">
          <span>⭐</span> Your best match
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Logo chip */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
              style={{
                background: result.logoColor + "18",
                border: `1.5px solid ${result.logoColor}40`,
                color: result.logoColor,
              }}
            >
              {result.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900">{result.name}</h3>
                {result.badge && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: result.logoColor + "15",
                      color: result.logoColor,
                    }}
                  >
                    {result.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{result.tagline}</p>
            </div>
          </div>

          {/* Match % */}
          <div className="text-right flex-shrink-0">
            <p
              className="text-2xl font-black"
              style={{ color: result.logoColor }}
            >
              {result.matchPercent}%
            </p>
            <p className="text-xs text-slate-400">match</p>
          </div>
        </div>

        {/* Match bar */}
        <div className="h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${result.matchPercent}%`,
              background: result.logoColor,
            }}
          />
        </div>

        {/* Reasons */}
        <ul className="space-y-1.5 mb-4">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <span
                className="mt-0.5 flex-shrink-0 font-bold"
                style={{ color: result.logoColor }}
              >
                ✓
              </span>
              {r}
            </li>
          ))}
        </ul>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Maker fee", value: `${result.makerFee}%` },
            { label: "Coins", value: `${result.coins}+` },
            { label: "US ok?", value: result.usBased ? "Yes ✓" : "No" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-slate-50 rounded-lg py-2 px-3 text-center"
            >
              <p className="text-xs font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Bonus */}
        <p className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg px-3 py-2 mb-4 font-medium">
          🎁 {result.bonus}
        </p>

        {/* CTA */}
        <div className="flex gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center transition-all duration-150 text-white"
            style={{
              background: result.logoColor,
              opacity: hovered ? 0.9 : 1,
            }}
          >
            Open {result.name} account →
          </a>
          <Link
            href={`/reviews/${result.id}`}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Review
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Results view ─────────────────────────────────────────────────────────────
function ResultsView({
  results,
  onRetake,
}: {
  results: ExchangeResult[];
  onRetake: () => void;
}) {
  const top3 = results.slice(0, 3);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
      <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-2">
        Your results
      </p>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
        Your top exchange matches
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Based on your answers — ranked by fit, not commission.
        <span className="text-brand-400 ml-1">
          (Affiliate disclosure: we earn a commission if you sign up.)
        </span>
      </p>

      <div className="grid gap-4">
        {top3.map((result, i) => (
          <ResultCard key={result.id} result={result} rank={i} />
        ))}
      </div>

      <button
        onClick={onRetake}
        className="mt-6 w-full py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
      >
        ↺ Retake quiz
      </button>
    </div>
  );
}

// ─── Main quiz component ──────────────────────────────────────────────────────
export function FindMyExchangeQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ExchangeResult[] | null>(null);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const totalSteps = QUIZ_QUESTIONS.length;
  const selectedAnswer = answers[currentQuestion?.id] ?? null;

  const handleSelect = useCallback((optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }, [currentQuestion?.id]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setResults(scoreExchanges(answers));
    }
  }, [currentStep, totalSteps, answers]);

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const handleRetake = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar — hide on results */}
      {!results && (
        <div className="mb-8">
          <ProgressBar current={currentStep + 1} total={totalSteps} />
        </div>
      )}

      {results ? (
        <ResultsView results={results} onRetake={handleRetake} />
      ) : (
        <QuestionStep
          question={currentQuestion}
          selected={selectedAnswer}
          onSelect={handleSelect}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentStep === 0}
          isLast={currentStep === totalSteps - 1}
          stepNum={currentStep + 1}
          totalSteps={totalSteps}
        />
      )}
    </div>
  );
}

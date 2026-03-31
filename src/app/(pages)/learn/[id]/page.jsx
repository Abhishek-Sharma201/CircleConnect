"use client";
import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, Circle, Trophy, ChevronRight, RotateCcw } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { apiFetch } from "@/src/lib/api";

export default function CoursePlayerPage({ params }) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [submittingProgress, setSubmittingProgress] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [courseData, enrollmentData] = await Promise.all([
          apiFetch(`/api/course/${id}`),
          apiFetch(`/api/course/${id}/enroll`, { method: "POST" }),
        ]);
        if (courseData.course) setCourse(courseData.course);
        if (enrollmentData.enrollment) {
          setEnrollment(enrollmentData.enrollment);
          const completed = enrollmentData.enrollment.completedModules || [];
          // Jump to first incomplete module
          const firstIncomplete = courseData.course?.modules?.findIndex(
            (_, idx) => !completed.includes(idx)
          );
          if (firstIncomplete !== -1 && firstIncomplete !== undefined) {
            setCurrentModuleIndex(firstIncomplete);
          }
        }
      } catch (err) {
        toast.error("Failed to load course");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  // Reset quiz when switching modules
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  }, [currentModuleIndex]);

  const isModuleDone = (idx) => enrollment?.completedModules?.includes(idx);

  const handleQuizAnswer = (questionIdx, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    const currentModule = course.modules[currentModuleIndex];
    const quiz = currentModule.quiz || [];

    const results = quiz.map((q, idx) => ({
      question: q.question,
      correct: quizAnswers[idx] === q.correctAnswer,
      correctAnswer: q.correctAnswer,
      userAnswer: quizAnswers[idx],
    }));

    const allCorrect = results.every((r) => r.correct);
    setQuizResults(results);
    setQuizSubmitted(true);

    if (allCorrect) {
      toast.success("All correct! Marking module as complete...");
      completeModule();
    } else {
      const wrongCount = results.filter((r) => !r.correct).length;
      toast.error(`${wrongCount} incorrect answer${wrongCount > 1 ? "s" : ""}. Review and try again.`);
    }
  };

  const completeModule = async () => {
    setSubmittingProgress(true);
    try {
      const data = await apiFetch(`/api/course/${id}/progress`, {
        method: "PUT",
        body: JSON.stringify({ moduleIndex: currentModuleIndex }),
      });
      setEnrollment(data.enrollment);
      if (data.enrollment.isCompleted) {
        toast.success("Course Completed! Badge Awarded!");
      } else if (currentModuleIndex < course.modules.length - 1) {
        setCurrentModuleIndex((prev) => prev + 1);
      }
    } catch (err) {
      toast.error(err.message || "Failed to save progress");
    } finally {
      setSubmittingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-[var(--accents-5)]" />
      </div>
    );
  }
  if (!course) return <div className="text-[var(--geist-foreground)] p-10">Course not found</div>;

  const currentModule = course.modules[currentModuleIndex];
  const isCompleted = isModuleDone(currentModuleIndex);
  const quiz = currentModule?.quiz || [];
  const allAnswered = quiz.length === 0 || Object.keys(quizAnswers).length === quiz.length;

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-[var(--accents-1)] border-r border-[var(--accents-2)] flex flex-col shrink-0">
        <div className="p-4 border-b border-[var(--accents-2)]">
          <h2 className="text-[15px] font-bold text-[var(--geist-foreground)] line-clamp-2">
            {course.title}
          </h2>
          <div className="mt-3 text-[12px] text-[var(--accents-5)]">
            Progress: {Math.round(enrollment?.progress || 0)}%
          </div>
          <div className="w-full bg-[var(--accents-2)] h-1.5 mt-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[var(--geist-success)] h-full transition-all duration-500 rounded-full"
              style={{ width: `${enrollment?.progress || 0}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {course.modules.map((mod, idx) => {
            const done = isModuleDone(idx);
            const active = currentModuleIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentModuleIndex(idx)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                  active
                    ? "bg-[var(--geist-foreground)] text-[var(--geist-background)]"
                    : "hover:bg-[var(--accents-2)] text-[var(--accents-6)]"
                }`}
              >
                {done ? (
                  <CheckCircle size={16} className={active ? "text-[var(--geist-background)]" : "text-[var(--geist-success)]"} />
                ) : (
                  <Circle size={16} className="text-[var(--accents-4)]" />
                )}
                <span className="text-[13px] line-clamp-1">{mod.title}</span>
              </button>
            );
          })}
        </div>

        {enrollment?.isCompleted && (
          <div className="p-4 border-t border-[var(--accents-2)] bg-[var(--geist-success-light)]">
            <div className="flex items-center gap-2 text-[var(--geist-success)] font-bold text-[14px]">
              <Trophy size={16} />
              Course Completed!
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 bg-[var(--geist-background)]">
        <div className="max-w-3xl mx-auto">
          {/* Module title + status */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[26px] font-bold text-[var(--geist-foreground)]">
              {currentModule.title}
            </h1>
            {isCompleted && (
              <span className="flex items-center gap-1.5 text-[13px] text-[var(--geist-success)] border border-[var(--geist-success)] rounded-full px-3 py-1">
                <CheckCircle size={14} /> Completed
              </span>
            )}
          </div>

          {/* Module content */}
          <div className="prose prose-invert max-w-none mb-10 text-[var(--geist-foreground)]">
            <ReactMarkdown>{currentModule.content}</ReactMarkdown>
          </div>

          {/* Video */}
          {currentModule.videoUrl && (
            <div className="mb-10 rounded-xl overflow-hidden border border-[var(--accents-2)]">
              <iframe
                src={currentModule.videoUrl}
                className="w-full aspect-video"
                allowFullScreen
                title={currentModule.title}
              />
            </div>
          )}

          {/* Quiz Section */}
          {quiz.length > 0 && !isCompleted && (
            <div className="border border-[var(--accents-2)] rounded-xl p-6 flex flex-col gap-6">
              <h2 className="text-[18px] font-bold text-[var(--geist-foreground)]">
                Knowledge Check
              </h2>

              {quiz.map((question, qIdx) => {
                const userAnswer = quizAnswers[qIdx];
                const result = quizResults?.[qIdx];
                return (
                  <div key={qIdx} className="flex flex-col gap-3">
                    <p className="text-[14px] font-medium text-[var(--geist-foreground)]">
                      {qIdx + 1}. {question.question}
                    </p>
                    <div className="flex flex-col gap-2">
                      {question.options.map((opt, oIdx) => {
                        let optionClass = "border-[var(--accents-2)] text-[var(--accents-6)] hover:border-[var(--accents-5)]";
                        if (quizSubmitted && result) {
                          if (oIdx === question.correctAnswer) {
                            optionClass = "border-[var(--geist-success)] bg-[var(--geist-success-light)] text-[var(--geist-success)]";
                          } else if (oIdx === userAnswer && !result.correct) {
                            optionClass = "border-[var(--geist-error)] bg-[var(--geist-error-light)] text-[var(--geist-error)]";
                          } else {
                            optionClass = "border-[var(--accents-2)] text-[var(--accents-4)]";
                          }
                        } else if (userAnswer === oIdx) {
                          optionClass = "border-[var(--geist-foreground)] text-[var(--geist-foreground)] bg-[var(--accents-1)]";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleQuizAnswer(qIdx, oIdx)}
                            disabled={quizSubmitted}
                            className={`w-full text-left px-4 py-3 rounded-lg border text-[13px] transition-colors ${optionClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!allAnswered}
                  className="geist-btn geist-btn-primary self-start flex items-center gap-2"
                >
                  Submit Quiz <ChevronRight size={16} />
                </button>
              ) : !quizResults?.every((r) => r.correct) ? (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setQuizResults(null);
                  }}
                  className="geist-btn geist-btn-secondary self-start flex items-center gap-2"
                >
                  <RotateCcw size={14} /> Try Again
                </button>
              ) : null}
            </div>
          )}

          {/* No quiz — direct complete button */}
          {quiz.length === 0 && !isCompleted && (
            <button
              onClick={completeModule}
              disabled={submittingProgress}
              className="geist-btn geist-btn-primary flex items-center gap-2"
            >
              {submittingProgress ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
              Mark as Complete
            </button>
          )}

          {/* Next module shortcut */}
          {isCompleted && currentModuleIndex < course.modules.length - 1 && (
            <button
              onClick={() => setCurrentModuleIndex((p) => p + 1)}
              className="geist-btn geist-btn-primary flex items-center gap-2"
            >
              Next Module <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

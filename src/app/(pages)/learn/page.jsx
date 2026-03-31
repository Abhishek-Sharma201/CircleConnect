"use client";
import React, { useEffect, useState } from "react";
import { apiURL } from "@/src/constants";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import TopNav from "@/src/components/dashboard/TopNav";
import SecondaryNav from "@/src/components/dashboard/SecondaryNav";

export default function LearnPage() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearnData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          fetch(`${apiURL}/api/course/all`),
          fetch(`${apiURL}/api/course/my-enrollments`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          })
        ]);
        
        const coursesData = await coursesRes.json();
        const enrollmentsData = await enrollmentsRes.json();

        if (coursesData.success) setCourses(coursesData.courses);
        if (enrollmentsData.success) setEnrollments(enrollmentsData.enrollments);
      } catch (error) {
        console.error("Failed to fetch learn data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnData();
  }, []);

  if (loading) return (
    <div className="w-full min-h-screen bg-[var(--geist-background)] flex flex-col">
      <TopNav />
      <SecondaryNav />
      <div className="flex-1 flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-[var(--accents-5)] w-8 h-8"/>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[var(--geist-background)] flex flex-col items-center">
      {/* Learn page operates outside the dashboard layout folder, so we mount the nav manually to keep visual continuity */}
      <div className="w-full"><TopNav /></div>
      <div className="w-full"><SecondaryNav /></div>
      
      <div className="flex-1 w-full max-w-[1200px] px-6 py-10 flex flex-col gap-12">
        
        <header className="flex flex-col gap-2">
          <h1 className="geist-section-header">
            Micro-Courses
          </h1>
          <p className="text-[14px] text-[var(--accents-5)]">Upskill with bite-sized programming courses and earn verifiable badges.</p>
        </header>

        {enrollments.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="text-[16px] font-semibold text-[var(--geist-foreground)]">My Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map(en => (
                <Link href={`/learn/${en.course._id}`} key={en._id} className="geist-card p-5 group flex items-start gap-5">
                  <div className="w-20 h-20 bg-[var(--accents-1)] rounded-md border border-[var(--accents-2)] overflow-hidden shrink-0 flex items-center justify-center">
                    {en.course.thumbnail ? (
                      <img src={en.course.thumbnail} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="text-[var(--accents-4)]" size={24} />
                    )}
                  </div>
                  <div className="flex flex-col w-full">
                    <h3 className="text-[15px] font-semibold text-[var(--geist-foreground)] leading-snug group-hover:underline">{en.course.title}</h3>
                    <div className="mt-4 w-full bg-[var(--accents-2)] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[var(--geist-foreground)] h-full transition-all duration-500 ease-out rounded-r-full" style={{ width: `${Math.max(en.progress, 2)}%` }}></div>
                    </div>
                    <p className="text-[12px] font-medium text-[var(--accents-5)] mt-1.5 text-right">{Math.round(en.progress)}% Complete</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-6">
          <h2 className="text-[16px] font-semibold text-[var(--geist-foreground)] pt-4 border-t border-[var(--accents-2)]">Explore Courses</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link href={`/learn/${course._id}`} key={course._id} className="block group h-full">
                <div className="geist-card h-full flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="h-40 bg-[var(--accents-1)] border-b border-[var(--accents-2)] relative overflow-hidden flex items-center justify-center">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <BookOpen size={40} className="text-[var(--accents-3)] transition-transform duration-500 group-hover:scale-110"/>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <h3 className="text-[16px] font-semibold text-[var(--geist-foreground)] leading-snug group-hover:text-[var(--accents-6)]">{course.title}</h3>
                    <p className="text-[13px] text-[var(--accents-5)] line-clamp-3 leading-relaxed flex-1">{course.description}</p>
                    
                    <div className="flex items-center gap-2 pt-4 mt-auto border-t border-[var(--accents-2)]">
                      <div className="h-6 w-6 rounded-full border border-[var(--accents-2)] overflow-hidden bg-[var(--accents-1)]">
                        {course.author?.picture ? (
                           <img src={course.author?.picture} alt="" className="h-full w-full object-cover"/>
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-[var(--geist-foreground)] text-[var(--geist-background)] text-[10px] uppercase font-bold">
                             {course.author?.userName?.[0] || "?"}
                           </div>
                        )}
                      </div>
                      <span className="text-[12px] font-medium text-[var(--geist-foreground)]">{course.author?.userName || "Anonymous"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {courses.length === 0 && (
              <div className="col-span-full py-16 text-center border border-dashed border-[var(--accents-2)] rounded-lg">
                <p className="text-[14px] text-[var(--accents-5)]">No courses available yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

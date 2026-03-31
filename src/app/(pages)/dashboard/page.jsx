"use client";

import React, { useState, useEffect } from "react";
import { PostProvider } from "@/src/context/PostContext";
import Feed from "@/src/components/dashboard/Feed";
import OnboardingModal from "@/src/components/OnboardingModal";
import { useAuth } from "@/src/hooks/useAuth";

const Page = () => {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding if user hasn't completed it
    if (user && !loading && !user.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [user, loading]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Reload to fetch personalized feed
    window.location.reload();
  };

  return (
    <PostProvider user={user}>
      <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="mt-3 z-10 overflow-y-scroll h-full w-full">
          <Feed />
        </div>
      </div>
      
      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete}
      />
    </PostProvider>
  );
};

export default Page;

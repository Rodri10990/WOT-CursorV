import { Link, useRoute } from "wouter";
import { useEffect, useRef, useState } from "react";

export default function TabBar() {
  const tabRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  
  const isActive = (path: string) => {
    const [match] = useRoute(path);
    return match;
  };
  
  // Check if the tabs need to be scrollable
  useEffect(() => {
    const checkOverflow = () => {
      if (tabRef.current) {
        const isOverflowing = tabRef.current.scrollWidth > tabRef.current.clientWidth;
        setScrollable(isOverflowing);
      }
    };
    
    // Check on mount and on resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);
  
  // Scroll to active tab
  useEffect(() => {
    if (tabRef.current) {
      const activeTab = tabRef.current.querySelector('.text-primary');
      if (activeTab) {
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = tabRef.current.getBoundingClientRect();
        
        // If active tab is not fully visible
        if (tabRect.right > containerRect.right || tabRect.left < containerRect.left) {
          // Scroll to center the active tab
          tabRef.current.scrollLeft = 
            activeTab.parentElement!.offsetLeft - 
            (tabRef.current.clientWidth / 2) + 
            (activeTab.parentElement!.clientWidth / 2);
        }
      }
    }
  }, [isActive]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-50">
      <div 
        ref={tabRef} 
        className={`flex items-center h-16 ${
          scrollable ? 'overflow-x-auto overscroll-x-contain' : 'justify-around'
        }`}
      >
        <Link
          href="/"
          className={`flex items-center justify-center min-w-[20%] h-full ${
            isActive("/") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">home</span>
        </Link>
        
        <Link
          href="/workouts"
          className={`flex items-center justify-center min-w-[20%] h-full ${
            isActive("/workouts") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">fitness_center</span>
        </Link>
        
        <Link
          href="/ai-trainer"
          className={`flex items-center justify-center min-w-[20%] h-full ${
            isActive("/ai-trainer") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">smart_toy</span>
        </Link>
        
        <Link
          href="/nutrition"
          className={`flex items-center justify-center min-w-[20%] h-full ${
            isActive("/nutrition") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">restaurant</span>
        </Link>
        
        <Link
          href="/settings"
          className={`flex items-center justify-center min-w-[20%] h-full ${
            isActive("/settings") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">settings</span>
        </Link>
      </div>
    </div>
  );
}
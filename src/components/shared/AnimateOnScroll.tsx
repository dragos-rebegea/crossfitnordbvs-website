"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AnimationType =
  | "fade-in-left"
  | "fade-in-right"
  | "fade-in-up"
  | "bounce-in-up";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation: AnimationType;
  delay?: number;
  className?: string;
  threshold?: number;
}

export function AnimateOnScroll({
  children,
  animation,
  delay = 0,
  className,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const animationClass = {
    "fade-in-left": "animate-fade-in-left",
    "fade-in-right": "animate-fade-in-right",
    "fade-in-up": "animate-fade-in-up",
    "bounce-in-up": "animate-bounce-in-up",
  }[animation];

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0",
        isVisible && animationClass,
        className
      )}
      style={isVisible && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

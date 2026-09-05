"use client";

import { useEffect, useState } from "react";

export default function Spotlight() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPosition, setFollowerPosition] = useState({
    x: -100,
    y: -100,
  });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Hover effect on buttons, links, and interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Smooth lagging effect for the outer circle follower
  useEffect(() => {
    const followMouse = () => {
      setFollowerPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
    };

    const animationFrame = requestAnimationFrame(followMouse);
    return () => cancelAnimationFrame(animationFrame);
  }, [position, followerPosition]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden lg:block overflow-hidden">
      {/* 1. Background Radial Spotlight Effect (Glow Area) */}
      <div
        className="fixed inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, rgba(124, 255, 107, 0.05), transparent 75%)`,
        }}
      />

      {/* 2. Inner Small Solid Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#7CFF6B] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />

      {/* 3. Outer Smooth Following Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border border-[#7CFF6B]/60 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out ${
          isHovered
            ? "w-12 h-12 bg-[#7CFF6B]/15 border-[#7CFF6B] scale-110"
            : "w-8 h-8 bg-transparent"
        }`}
        style={{
          transform: `translate3d(${followerPosition.x}px, ${followerPosition.y}px, 0)`,
        }}
      />
    </div>
  );
}

// components/animations.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

// 1. Hiệu ứng xuất hiện khi cuộn (Fade Up / Down / Left / Right)
interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean; // chỉ chạy 1 lần
}

export function Reveal({ children, delay = 0, direction = "up", once = true }: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const directionOffset = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
  };

  const { x, y } = directionOffset[direction];

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x, y }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// 2. Container để chạy hiệu ứng lần lượt cho danh sách (Stagger)
export function StaggerContainer({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: delay },
        },
      }}
      className="flex flex-wrap justify-center gap-6"
    >
      {children}
    </motion.div>
  );
}

// 3. Item con sử dụng trong StaggerContainer
export const StaggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

// 4. Component đếm số (Count Up) – dùng cho các con số phần trăm
export function CountUp({ target, suffix = "%", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref} className="tabular-nums">
      {isInView ? target : 0}
      {suffix}
    </span>
  );
}

// 5. Nút bấm có hiệu ứng hover và tap
interface AnimatedButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}

export function AnimatedButton({ children, variant = "primary", className = "", onClick }: AnimatedButtonProps) {
  const baseClass =
    "px-6 py-3 rounded-xl font-medium transition-shadow duration-200 cursor-pointer inline-flex items-center justify-center";

  const variantClass = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "bg-white text-blue-600 border border-blue-300 hover:border-blue-500 hover:bg-blue-50",
  };

  return (
    <motion.button
      className={`${baseClass} ${variantClass[variant]} ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
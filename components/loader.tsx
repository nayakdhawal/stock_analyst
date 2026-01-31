"use client"

import React from "react"

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="hole relative w-[100px] h-[100px] flex items-center justify-center">
        {Array.from({ length: 10 }).map((_, i) => (
          <i
            key={i}
            className="bg-primary/80 block absolute w-[50px] h-[50px] rounded-[140px] opacity-0"
            style={{ animationDelay: `${(i + 1) * 0.3}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground font-medium animate-pulse tracking-wide">
        Analyzing Market Data...
      </p>

      <style jsx>{`
        .hole {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        i {
          display: block;
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 140px;
          opacity: 0;
          animation-name: scale;
          animation-duration: 3s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        @keyframes scale {
          0% {
            transform: scale(2);
            opacity: 0;
            box-shadow: 0px 0px 50px rgba(30, 58, 138, 0.7);
          }
          50% {
            transform: scale(1) translate(0px, -5px);
            opacity: 1;
            box-shadow: 0px 8px 20px rgba(30, 58, 138, 0.7);
          }
          100% {
            transform: scale(0.1) translate(0px, 5px);
            opacity: 0;
            box-shadow: 0px 10px 20px rgba(30, 58, 138, 0);
          }
        }
      `}</style>
    </div>
  )
}

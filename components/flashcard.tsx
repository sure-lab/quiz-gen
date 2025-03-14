"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type FlashcardProps = {
  question: string;
  answer: string;
  currentCard: number;
  totalCards: number;
};

export default function Flashcard({
  question,
  answer,
  currentCard,
  totalCards,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="icon">
          <Volume2 className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsStarred(!isStarred)}
        >
          <Star
            className={`h-5 w-5 ${
              isStarred ? "fill-yellow-400 text-yellow-400" : ""
            }`}
          />
        </Button>
      </div>

      {/* Card */}
      <div
        className="w-full aspect-[3/2] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute w-full h-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center backface-hidden">
            <div className="w-full h-full overflow-y-auto flex items-center justify-center">
              <h2 className="text-3xl font-normal text-center break-words">
                {question}
              </h2>
            </div>
            <div className="absolute bottom-6 text-sm text-gray-500">
              Click the card to flip
            </div>
          </div>
          <div
            className="absolute w-full h-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="w-full h-full overflow-y-auto flex items-center justify-center">
              <p className="text-3xl font-normal text-center break-words">
                {answer}
              </p>
            </div>
            <div className="absolute bottom-6 text-sm text-gray-500">
              Click the card to flip
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 text-center text-gray-500">
        {currentCard} / {totalCards}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Flashcard from "@/components/flashcard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

export default function FlashcardsPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashcards, setFlashcards] = useState<
    Array<{ question: string; answer: string }>
  >([]);

  useEffect(() => {
    const savedData = localStorage.getItem("flashcardData");
    if (!savedData) {
      router.push("/");
      return;
    }
    setFlashcards(JSON.parse(savedData));
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Back Button */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="absolute left-4 top-4 hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <Flashcard
            question={flashcards[currentIndex]?.question}
            answer={flashcards[currentIndex]?.answer}
            currentCard={currentIndex + 1}
            totalCards={flashcards.length}
          />
          <div className="flex justify-between items-center px-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentIndex((i) => i - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={currentIndex === flashcards.length - 1}
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

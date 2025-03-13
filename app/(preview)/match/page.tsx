"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MatchCard from "@/components/match-card";
import { Button } from "@/components/ui/button";
import { MatchIcon } from "@/components/icons";
import { ArrowLeft } from "lucide-react";

export default function MatchPage() {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [terms, setTerms] = useState<
    Array<{ term: string; definition: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem("matchData");
    if (!savedData) {
      router.push("/");
      return;
    }
    setTerms(JSON.parse(savedData));
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!gameStarted) {
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

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <MatchIcon />
            </div>

            <h1 className="text-2xl font-semibold text-white">
              Ready to play?
            </h1>

            <p className="text-center px-4 text-white">
              Match all the terms with their definitions as fast as you can.
              Avoid wrong matches, they add extra time!
            </p>

            <Button
              className="w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg text-lg"
              onClick={() => setGameStarted(true)}
            >
              Start game
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <MatchCard terms={terms} />
        </div>
      </div>
    </div>
  );
}

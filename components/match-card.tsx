"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type MatchCardProps = {
  terms: Array<{
    term: string;
    definition: string;
  }>;
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MatchCard({ terms }: MatchCardProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(
    null
  );
  const [matches, setMatches] = useState<
    Array<{ term: string; definition: string }>
  >([]);
  const [remainingTerms, setRemainingTerms] = useState(terms);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isCorrectMatch, setIsCorrectMatch] = useState<boolean | null>(null);
  const [isWrongMatch, setIsWrongMatch] = useState<boolean | null>(null);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && remainingTerms.length > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingTerms.length]);

  useEffect(() => {
    if (!isRunning && remainingTerms.length > 0) {
      setIsRunning(true);
    }
  }, [remainingTerms.length, isRunning]);

  useEffect(() => {
    if (selectedTerm && selectedDefinition) {
      checkMatch();
    }
  }, [selectedTerm, selectedDefinition]);

  useEffect(() => {
    setShuffledDefinitions(shuffleArray(terms.map((t) => t.definition)));
  }, [terms]);

  const checkMatch = async () => {
    if (!selectedTerm || !selectedDefinition) return;

    const matchedTerm = terms.find((t) => t.term === selectedTerm);
    const isCorrect = matchedTerm?.definition === selectedDefinition;

    if (isCorrect) {
      setIsCorrectMatch(true);

      setTimeout(() => {
        const matchedPair = {
          term: selectedTerm,
          definition: selectedDefinition,
        };
        setMatches([...matches, matchedPair]);

        // Update remaining terms and definitions
        const newRemainingTerms = remainingTerms.filter(
          (t) => t.term !== selectedTerm
        );
        setRemainingTerms(newRemainingTerms);

        // Update shuffled definitions
        setShuffledDefinitions(
          shuffledDefinitions.filter((def) => def !== selectedDefinition)
        );

        // Check if game is complete
        if (newRemainingTerms.length === 0) {
          setIsRunning(false);
          toast.success(
            `Congratulations! You completed the game in ${timer.toFixed(
              1
            )} seconds with ${wrongAttempts} wrong attempts.`
          );
        }

        setSelectedTerm(null);
        setSelectedDefinition(null);
        setIsCorrectMatch(null);
      }, 1000);
    } else {
      setIsWrongMatch(true);
      setWrongAttempts((prev) => prev + 1);
      setTimer((prev) => prev + 2);

      setTimeout(() => {
        setSelectedTerm(null);
        setSelectedDefinition(null);
        setIsWrongMatch(null);
      }, 1000);
    }
  };

  const handleTermClick = (term: string) => {
    if (isCorrectMatch || isWrongMatch) return;
    setSelectedTerm(term);
  };

  const handleDefinitionClick = (definition: string) => {
    if (isCorrectMatch || isWrongMatch) return;
    setSelectedDefinition(definition);
  };

  const getTermCardStyle = (term: string) => {
    if (selectedTerm === term && isCorrectMatch) {
      return "bg-green-100/50 border-2 border-green-500";
    } else if (selectedTerm === term && isWrongMatch) {
      return "bg-red-100/50 border-2 border-red-500";
    } else if (selectedTerm === term) {
      return "bg-blue-100/50 border-2 border-blue-500";
    } else {
      return "bg-white/10 border border-gray-200/20";
    }
  };

  const getDefinitionCardStyle = (definition: string) => {
    if (selectedDefinition === definition && isCorrectMatch) {
      return "bg-green-100/50 border-2 border-green-500";
    } else if (selectedDefinition === definition && isWrongMatch) {
      return "bg-red-100/50 border-2 border-red-500";
    } else if (selectedDefinition === definition) {
      return "bg-blue-100/50 border-2 border-blue-500";
    } else {
      return "bg-white/10 border border-gray-200/20";
    }
  };

  const resetGame = () => {
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setMatches([]);
    setRemainingTerms([...terms]); // Create new array to avoid reference issues
    setShuffledDefinitions(shuffleArray([...terms].map((t) => t.definition))); // Create new array for definitions
    setTimer(0);
    setIsRunning(true);
    setWrongAttempts(0);
    setIsCorrectMatch(null);
    setIsWrongMatch(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 p-4">
      {remainingTerms.length > 0 && (
        <div className="fixed top-14 left-0 right-0 z-40 p-4 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto">
            <div className="text-center text-lg font-medium text-white">
              Time: {timer.toFixed(1)}s | Wrong Attempts: {wrongAttempts}
            </div>
          </div>
        </div>
      )}

      <div className={`${remainingTerms.length > 0 ? "pt-24" : ""}`}>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <AnimatePresence>
              {remainingTerms.map((item) => (
                <motion.div
                  key={item.term}
                  className={`w-full h-[200px] rounded-2xl cursor-pointer flex items-center justify-center p-6 text-center transition-all duration-200 shadow-md backdrop-blur-sm ${getTermCardStyle(
                    item.term
                  )}`}
                  onClick={() => handleTermClick(item.term)}
                  whileHover={{ scale: 1.02 }}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <span className="text-lg text-white">{item.term}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {remainingTerms.map((item, index) => (
                <motion.div
                  key={item.definition}
                  className={`w-full h-[200px] rounded-2xl cursor-pointer flex items-center justify-center p-6 text-center transition-all duration-200 shadow-md backdrop-blur-sm ${getDefinitionCardStyle(
                    shuffledDefinitions[index]
                  )}`}
                  onClick={() =>
                    handleDefinitionClick(shuffledDefinitions[index])
                  }
                  whileHover={{ scale: 1.02 }}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <span className="text-lg text-white">
                    {shuffledDefinitions[index]}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {remainingTerms.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 backdrop-blur-sm rounded-xl border mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Congratulations!
          </h2>
          <p className="text-white/80 mb-6">
            You completed the game in {timer.toFixed(1)} seconds with{" "}
            {wrongAttempts} wrong attempts.
          </p>
          <Button
            onClick={resetGame}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}

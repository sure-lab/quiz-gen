"use client";

import { useState, useEffect } from "react";
import { experimental_useObject } from "ai/react";
import { flashcardSchema, matchSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { FileUp, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { z } from "zod";

type ObjectType = z.infer<typeof flashcardSchema> | z.infer<typeof matchSchema>;

export default function LearningModes() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [encodedFile, setEncodedFile] = useState<string | null>(null);
  const [mode, setMode] = useState<"flashcard" | "match" | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load saved file data on mount
  useEffect(() => {
    if (isMounted) {
      const savedFile = localStorage.getItem("uploadedFile");
      if (savedFile) {
        setEncodedFile(savedFile);
        setFile(new File([], "saved-file.pdf")); // Dummy file for UI
      }
    }
  }, [isMounted]);
  console.log("mode2", mode);

  const {
    submit,
    object: questions,
    isLoading,
  } = experimental_useObject<ObjectType>({
    api:
      mode === "flashcard"
        ? "/api/generate-flashcards"
        : "/api/generate-matches",
    schema: mode === "flashcard" ? flashcardSchema : matchSchema,
    initialValue: undefined,
    onError: (error) => {
      if (isMounted) {
        toast.error("Failed to generate questions. Please try again.");
      }
    },
    onFinish: ({ object }) => {
      console.log("object", object);

      // Get the selected mode from localStorage
      const selectedMode = localStorage.getItem("selectedMode") as
        | "flashcard"
        | "match"
        | null;

      if (!object || !selectedMode) return;

      try {
        localStorage.setItem(
          selectedMode === "flashcard" ? "flashcardData" : "matchData",
          JSON.stringify(object)
        );

        toast.success(
          `${
            selectedMode === "flashcard" ? "Flashcards" : "Match game"
          } generated successfully!`
        );

        router.push(selectedMode === "flashcard" ? "/flashcards" : "/match");
      } catch (error) {
        console.error("Error saving data:", error);
        if (isMounted) {
          toast.error("Failed to save generated content");
        }
      }
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" ||
      selectedFile.size > 5 * 1024 * 1024
    ) {
      toast.error("Only PDF files under 5MB are allowed.");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const base64 = reader.result as string;
      setEncodedFile(base64);
      localStorage.setItem("uploadedFile", base64); // Save file data
    };
  };

  const handleBack = () => {
    // Only clear file data when going back to main page
    localStorage.removeItem("uploadedFile");
    setFile(null);
    setEncodedFile(null);
    setMode(null);
  };

  const generateQuestions = (selectedMode: "flashcard" | "match") => {
    if (!encodedFile) return;

    // Store the selected mode in localStorage
    localStorage.setItem("selectedMode", selectedMode);

    setMode(selectedMode);
    submit({ files: [{ data: encodedFile, type: "application/pdf" }] });
  };

  // Show loading state during initial render
  if (!isMounted) {
    return (
      <div className="min-h-[100dvh] w-full flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Loading...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-[100dvh] w-full flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Upload Your Study Material
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Drop your PDF here or click to browse.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="absolute left-4 top-4 hover:bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center pt-4">
            Choose Learning Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => generateQuestions("flashcard")}
            disabled={isLoading}
            className="h-32 flex flex-col gap-2"
          >
            {isLoading && mode === "flashcard" ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <span className="text-xl">📝</span>
                <span>Flashcards</span>
              </>
            )}
          </Button>
          <Button
            onClick={() => generateQuestions("match")}
            disabled={isLoading}
            className="h-32 flex flex-col gap-2"
          >
            {isLoading && mode === "match" ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <span className="text-xl">🔄</span>
                <span>Matching</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

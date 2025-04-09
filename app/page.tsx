"use client";

import { useState } from "react";
import AudioChopper from "@/components/AudioChopper";
import { ArrowUpRightIcon, FileAudio, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tighter mb-8">
          Audio Chopper
        </h1>

        {!audioUrl ? (
          <div className="text-center border border-neutral-300 rounded-lg p-8 border-dashed">
            <FileAudio className="mx-auto size-12 text-neutral-400 stroke-[1.4]" />
            <h3 className="mt-2 text-sm font-semibold text-neutral-900 tracking-tight">
              No Audio File Uploaded
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Get started by uploading an audio file.
            </p>
            <div className="mt-3">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <Button
                type="button"
                className="inline-flex items-center bg-black rounded-full px-4 py-2 pr-5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
                onClick={() => document.getElementById("audio-upload")?.click()}
              >
                <PlusIcon
                  aria-hidden="true"
                  className="-ml-0.5 mr-0.5 size-5"
                />
                Upload Audio File
              </Button>
            </div>
          </div>
        ) : (
          <AudioChopper audioUrl={audioUrl} />
        )}
      </div>
      <div className="flex justify-between flex-col lg:flex-row gap-4 max-w-4xl mx-auto py-8 p-2">
        <p className="text-sm text-neutral-600">
          A tool by{" "}
          <a
            href="https://www.ruslan.in"
            target="_blank"
            className="text-black font-semibold tracking-tight hover:underline"
          >
            Ruslan Mukhamedvaleev.
          </a>{" "}
        </p>
        <div className="text-sm text-neutral-600">
          © {new Date().getFullYear()} ·{" "}
          <a
            href="https://github.com/digitalRM/audio-chopper"
            target="_blank"
            className="hover:underline"
          >
            View GitHub{" "}
            <ArrowUpRightIcon className="-ml-0.5 h-4 w-4 -mt-[3px] stroke-[1.6] inline-block" />
          </a>
        </div>
      </div>
    </main>
  );
}

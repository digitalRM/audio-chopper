"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Scissors, Download } from "lucide-react";

interface AudioChopperProps {
  audioUrl: string;
}

export default function AudioChopper({ audioUrl }: AudioChopperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [splitPoints, setSplitPoints] = useState<number[]>([]);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#4a90e2",
        progressColor: "#2c5282",
        cursorColor: "#2c5282",
        barWidth: 2,
        barRadius: 3,
        height: 100,
        normalize: true,
      });

      wavesurfer.load(audioUrl);

      wavesurfer.on("ready", () => {
        wavesurferRef.current = wavesurfer;
        const audioContext = new AudioContext();
        fetch(audioUrl)
          .then((response) => response.arrayBuffer())
          .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
          .then((buffer) => setAudioBuffer(buffer));
      });

      return () => {
        wavesurfer.destroy();
      };
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSplit = () => {
    if (wavesurferRef.current) {
      const currentTime = wavesurferRef.current.getCurrentTime();
      setSplitPoints([...splitPoints, currentTime].sort((a, b) => a - b));
    }
  };

  const handleDownload = async (start: number, end: number) => {
    if (!audioBuffer) return;

    const audioContext = new AudioContext();
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      (end - start) * audioBuffer.sampleRate,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0, start, end - start);

    const renderedBuffer = await offlineContext.startRendering();
    const wavBlob = await bufferToWav(renderedBuffer);
    const url = URL.createObjectURL(wavBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `clip_${start.toFixed(2)}-${end.toFixed(2)}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const bufferToWav = async (buffer: AudioBuffer): Promise<Blob> => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const bytesPerFrame = numChannels * bytesPerSample;

    const wav = new ArrayBuffer(44 + buffer.length * bytesPerFrame);
    const view = new DataView(wav);

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + buffer.length * bytesPerFrame, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * bytesPerFrame, true);
    view.setUint16(32, bytesPerFrame, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, "data");
    view.setUint32(40, buffer.length * bytesPerFrame, true);

    const offset = 44;
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(
          offset + i * bytesPerFrame + channel * bytesPerSample,
          sample * 0x7fff,
          true
        );
      }
    }

    return new Blob([wav], { type: "audio/wav" });
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 border border-neutral-300 rounded-lg rounded-b-[36px] pb-0">
      <div ref={containerRef} className="w-full mb-4" />

      <div className="flex gap-2 mb-4">
        <button
          onClick={handlePlayPause}
          className="px-4 py-1.5 bg-black text-white rounded-full hover:bg-black/80 font-semibold tracking-tight cursor-pointer flex items-center gap-2"
        >
          {isPlaying ? (
            <Pause
              className="-ml-0.5 text-white"
              fill="currentColor"
              size={20}
            />
          ) : (
            <Play
              className="-ml-0.5 text-white"
              fill="currentColor"
              size={20}
            />
          )}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={handleSplit}
          className="px-4 py-1.5 bg-white text-black rounded-full hover:bg-black/10 font-semibold tracking-tighter cursor-pointer flex items-center gap-2 border border-neutral-300"
        >
          <Scissors className="-ml-0.5 text-black" size={20} />
          Split at Current Position
        </button>
      </div>

      <div className="space-y-2">
        {splitPoints.length > 0 && (
          <div className="space-y-2 pb-4">
            <h3 className="text-lg font-semibold tracking-tight text-black">
              Generated Clips:
            </h3>
            {[0, ...splitPoints].map((start, index) => {
              const end =
                index < splitPoints.length
                  ? splitPoints[index]
                  : wavesurferRef.current?.getDuration() || 0;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white border border-neutral-300 rounded-full"
                >
                  <span className="tracking-tight ml-1">
                    Clip {index + 1}: {start.toFixed(2)}s - {end.toFixed(2)}s
                  </span>
                  <button
                    onClick={() => handleDownload(start, end)}
                    className="px-3 py-1 bg-black text-white rounded-full hover:bg-black/80 flex items-center gap-2 text-sm font-semibold tracking-tighter"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

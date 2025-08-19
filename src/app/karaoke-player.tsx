'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { LyricsTranscriptionWebhookBody } from '@/types/replicate';
import {
    FastForward,
    Pause,
    Play,
    Rewind,
    SkipBack,
    SkipForward,
    Volume,
    Volume2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type KaraokePageProps = {
    audioSrc?: string;
    lyrics: LyricsTranscriptionWebhookBody['output']['chunks'];
};

export const KaraokePlayer = ({ audioSrc, lyrics: fetchedLyrics }: KaraokePageProps) => {
    const [currentLine, setCurrentLine] = useState(0);
    const [timeProgress, setTimeProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(100);

    const playAnimationRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarValueRef = useRef<number>(0);
    const lyrics = useRef<LyricsTranscriptionWebhookBody['output']['chunks']>([]);

    const onLoadedMetadata = () => {
        if (!audioRef.current) return;
        setDuration(audioRef.current.duration);
    };

    const repeat = useCallback(() => {
        if (!audioRef.current) return;

        const currentTime = audioRef.current.currentTime;
        let line = -1;
        for (let i = 0; i < lyrics.current.length; i++) {
            if (currentTime >= lyrics.current[i]!.timestamp[0]!) {
                line = i;
            }
        }

        if (line !== -1 && line !== currentLine) {
            setCurrentLine(line);
        }

        progressBarValueRef.current = currentTime;
        setTimeProgress(currentTime);

        playAnimationRef.current = requestAnimationFrame(repeat);
    }, [currentLine]);

    useEffect(() => {
        if (fetchedLyrics) {
            lyrics.current = fetchedLyrics;
        }
    }, [fetchedLyrics]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
        playAnimationRef.current = requestAnimationFrame(repeat);

        return () => {
            if (playAnimationRef.current) {
                cancelAnimationFrame(playAnimationRef.current);
            }
        };
    }, [isPlaying, repeat]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const handleSkipBack = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const handleRewind = () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    };

    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    const handleFastForward = () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = Math.min(
            audioRef.current.duration,
            audioRef.current.currentTime + 5,
        );
    };

    const handleSkipForward = () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = audioRef.current.duration;
    };

    const formatTime = (time: number) => {
        if (time && !isNaN(time)) {
            const minutes = Math.floor(time / 60);
            const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
            const seconds = Math.floor(time % 60);
            const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${formatMinutes}:${formatSeconds}`;
        }
        return '00:00';
    };

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto space-y-6 p-4">
            {/* Hidden audio element */}
            <audio
                src={audioSrc}
                ref={audioRef}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            >
                Your browser does not support the <code>audio</code> element.
            </audio>

            {/* Lyrics ScrollArea */}
            <ScrollArea className="h-[600px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <div className="flex flex-col px-4 py-6 space-y-3">
                    {lyrics.current.map((line, index) => {
                        const isActive = index === currentLine;
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    if (audioRef.current) {
                                        audioRef.current.currentTime = line.timestamp[0]!;
                                    }
                                }}
                                className={`w-full text-left text-lg font-semibold rounded-md px-4 py-2 transition-colors duration-200
                                    ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-indigo-100 text-gray-800'}
                                    focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                type="button"
                            >
                                {line.text}
                            </button>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Progress bar and time labels */}
            <div className="flex items-center justify-center space-x-4 px-4">
                <span className="text-xs text-gray-500 font-mono tabular-nums">{formatTime(timeProgress)}</span>
                <Slider
                    className="flex-1 h-2"
                    min={0}
                    max={duration}
                    value={[progressBarValueRef.current]}
                    onValueChange={(val) => {
                        if (!val[0]) return;
                        if (audioRef.current) {
                            progressBarValueRef.current = val[0];
                            audioRef.current.currentTime = val[0];
                        }
                    }}
                    step={0.01}
                    aria-label="Audio progress"
                    includesThumb={false}
                />
                <span className="text-xs text-gray-500 font-mono tabular-nums">{formatTime(duration)}</span>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-center space-x-3">
                <Button
                    type="button"
                    title="Skip back"
                    variant="outline"
                    size="icon"
                    className="rounded-full p-2"
                    onClick={handleSkipBack}
                    aria-label="Skip back"
                >
                    <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                    type="button"
                    title="Rewind"
                    variant="outline"
                    size="icon"
                    className="rounded-full p-2"
                    onClick={handleRewind}
                    aria-label="Rewind 5 seconds"
                >
                    <Rewind className="h-5 w-5" />
                </Button>
                <Button
                    type="button"
                    title={isPlaying ? 'Pause' : 'Play'}
                    variant="outline"
                    size="icon"
                    className="rounded-full p-3 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <Pause className="h-6 w-6" />
                    ) : (
                        <Play className="h-6 w-6" />
                    )}
                </Button>
                <Button
                    type="button"
                    title="Fast forward"
                    variant="outline"
                    size="icon"
                    className="rounded-full p-2"
                    onClick={handleFastForward}
                    aria-label="Fast forward 5 seconds"
                >
                    <FastForward className="h-5 w-5" />
                </Button>
                <Button
                    type="button"
                    title="Skip forward"
                    variant="outline"
                    size="icon"
                    className="rounded-full p-2"
                    onClick={handleSkipForward}
                    aria-label="Skip forward"
                >
                    <SkipForward className="h-5 w-5" />
                </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center space-x-2 max-w-sm mx-auto px-6">
                <Volume className="h-6 w-6 text-gray-600" aria-hidden="true" />
                <Slider
                    id="volumeInput"
                    min={0}
                    max={100}
                    step={1}
                    value={[volume]}
                    onValueChange={(val) => {
                        if (!val[0]) return;
                        setVolume(val[0]);
                    }}
                    className="flex-1 h-2"
                    aria-label="Volume"
                />
                <Volume2 className="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
        </div>
    );
};

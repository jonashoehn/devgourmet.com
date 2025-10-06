import {useEffect, useState} from 'react';
import {useRecipe} from "../../context";

interface TimerProps {
    line: number;
}

export function Timer({line}: TimerProps) {
    const {activeTimers, startTimer, pauseTimer, resumeTimer, stopTimer} = useRecipe();
    const [displayTime, setDisplayTime] = useState<number>(0);

    const timer = activeTimers.get(line);

    // Update display time
    useEffect(() => {
        if (!timer) {
            setDisplayTime(0);
            return;
        }

        if (timer.isRunning && timer.startTime) {
            const interval = setInterval(() => {
                const elapsed = (Date.now() - timer.startTime!) / 1000;
                const remaining = Math.max(0, timer.remaining - elapsed);
                setDisplayTime(remaining);

                // Timer complete
                if (remaining <= 0) {
                    stopTimer(line);
                    // Play notification sound (optional)
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('Timer Complete! ⏰', {
                            body: 'Your cooking timer has finished',
                        });
                    }
                }
            }, 100);

            return () => clearInterval(interval);
        } else {
            setDisplayTime(timer.remaining);
        }
    }, [timer, line, stopTimer]);

    if (!timer) {
        return null;
    }

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((timer.duration - displayTime) / timer.duration) * 100;

    return (
        <div
            className="inline-flex items-center gap-2 ml-2 px-3 py-1 bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] rounded-lg">
            {/* Time display */}
            <span className="font-mono text-sm text-[var(--color-number)] min-w-[48px]">
        {formatTime(displayTime)}
      </span>

            {/* Progress bar */}
            <div className="w-24 h-1.5 bg-[var(--color-ide-bg)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--color-accent)] transition-all duration-200"
                    style={{width: `${progress}%`}}
                />
            </div>

            {/* Control buttons */}
            <div className="flex gap-1">
                {!timer.isRunning && !timer.isPaused && (
                    <button
                        onClick={() => startTimer(line)}
                        className="w-6 h-6 flex items-center justify-center text-[var(--color-success)] hover:bg-[var(--color-ide-bg)] rounded transition-colors"
                        title="Start timer"
                    >
                        ▶
                    </button>
                )}

                {timer.isRunning && (
                    <button
                        onClick={() => pauseTimer(line)}
                        className="w-6 h-6 flex items-center justify-center text-[var(--color-warning)] hover:bg-[var(--color-ide-bg)] rounded transition-colors"
                        title="Pause timer"
                    >
                        ⏸
                    </button>
                )}

                {timer.isPaused && (
                    <button
                        onClick={() => resumeTimer(line)}
                        className="w-6 h-6 flex items-center justify-center text-[var(--color-success)] hover:bg-[var(--color-ide-bg)] rounded transition-colors"
                        title="Resume timer"
                    >
                        ▶
                    </button>
                )}

                <button
                    onClick={() => stopTimer(line)}
                    className="w-6 h-6 flex items-center justify-center text-[var(--color-error)] hover:bg-[var(--color-ide-bg)] rounded transition-colors"
                    title="Stop timer"
                >
                    ⏹
                </button>
            </div>
        </div>
    );
}

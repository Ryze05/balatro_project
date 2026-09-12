import { useEffect, useRef, useState, type JSX } from "react";
import { useLocation } from "react-router-dom";
import styles from "./BackgroundMusic.module.css";

const TRACK_SRC = "/audio/balatro-theme.mp3"; // coloca aquí tu pista de audio
const MUTED_KEY = "balatro-music-muted";
const VOLUME_KEY = "balatro-music-volume";
const LANDING_PATH = "/";
const DEFAULT_VOLUME = 0.5;

function getStoredVolume(): number {
    const stored = localStorage.getItem(VOLUME_KEY);
    const parsed = stored !== null ? Number(stored) : NaN;
    return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : DEFAULT_VOLUME;
}

export function BackgroundMusic(): JSX.Element {
    const location = useLocation();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [muted, setMuted] = useState<boolean>(
        () => localStorage.getItem(MUTED_KEY) === "true",
    );
    const [volume, setVolume] = useState<number>(getStoredVolume);

    //* Reproduce fuera de la Landing, pausa dentro de ella
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (location.pathname === LANDING_PATH) {
            audio.pause();
            return;
        }

        if (!muted) {
            audio.play().catch(() => { });
        }
    }, [location.pathname, muted]);

    //* Aplica volumen/mute al elemento de audio cada vez que cambian
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
        audio.muted = muted;
    }, [volume, muted]);

    //* Fallback por si el navegador bloqueó el autoplay
    useEffect(() => {
        const resume = (): void => {
            const audio = audioRef.current;
            if (!audio || muted || location.pathname === LANDING_PATH) return;
            if (audio.paused) audio.play().catch(() => { });
        };
        window.addEventListener("pointerdown", resume);
        return () => window.removeEventListener("pointerdown", resume);
    }, [muted, location.pathname]);

    const toggleMute = (): void => {
        setMuted((prev) => {
            const next = !prev;
            localStorage.setItem(MUTED_KEY, String(next));
            if (!next && location.pathname !== LANDING_PATH) {
                audioRef.current?.play().catch(() => { });
            }
            return next;
        });
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const next = Number(e.target.value);
        setVolume(next);
        localStorage.setItem(VOLUME_KEY, String(next));

        //* Si arrastras el slider desde 0, tiene sentido desmutear automáticamente
        if (next > 0 && muted) {
            setMuted(false);
            localStorage.setItem(MUTED_KEY, "false");
        }
    };

    const isOnLanding = location.pathname === LANDING_PATH;

    return (
        <>
            <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" />
            {!isOnLanding && (
                <div className={styles.controls}>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={toggleMute}
                        aria-label={muted ? "Activar música" : "Silenciar música"}
                    >
                        {muted || volume === 0 ? "🔇" : "🔊"}
                    </button>
                    <input
                        type="range"
                        className={styles.slider}
                        min={0}
                        max={1}
                        step={0.01}
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        aria-label="Volumen de la música"
                    />
                </div>
            )}
        </>
    );
}

export default BackgroundMusic;
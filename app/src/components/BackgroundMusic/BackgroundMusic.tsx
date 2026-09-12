import { useEffect, useRef, useState, type JSX } from "react";
import { useLocation } from "react-router-dom";
import styles from "./BackgroundMusic.module.css";

const TRACK_SRC = "/audio/balatro-theme.mp3"; // coloca aquí tu pista de audio
const STORAGE_KEY = "balatro-music-muted";
const LANDING_PATH = "/";

export function BackgroundMusic(): JSX.Element {
    const location = useLocation();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [muted, setMuted] = useState<boolean>(
        () => localStorage.getItem(STORAGE_KEY) === "true",
    );

    //* Reproduce fuera de la Landing, pausa dentro de ella
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (location.pathname === LANDING_PATH) {
            audio.pause();
            return;
        }

        if (!muted) {
            //* Si venimos de un click (p.ej. el link "Ir al Menú"), el navegador
            //* suele permitir el autoplay. Si lo bloquea, el listener de abajo
            //* lo reanuda en la primera interacción dentro del juego.
            audio.play().catch(() => { });
        }
    }, [location.pathname, muted]);

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
            localStorage.setItem(STORAGE_KEY, String(next));
            const audio = audioRef.current;
            if (audio) {
                if (next) audio.pause();
                else if (location.pathname !== LANDING_PATH) audio.play().catch(() => { });
            }
            return next;
        });
    };

    return (
        <>
            <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" />
            {location.pathname !== LANDING_PATH && (
                <button
                    type="button"
                    className={styles.button}
                    onClick={toggleMute}
                    aria-label={muted ? "Activar música" : "Silenciar música"}
                >
                    {muted ? "🔇" : "🔊"}
                </button>
            )}
        </>
    );
}

export default BackgroundMusic;
import { useEffect, useRef, useState, type JSX } from "react";
import { useLocation } from "react-router-dom";
import styles from "./BackgroundMusic.module.css";
import { TRACK_LIST, type Track } from "../../logic/audio";

const MUTED_KEY = "balatro-music-muted";
const VOLUME_KEY = "balatro-music-volume";
const TRACK_KEY = "balatro-music-track";
const LOOP_KEY = "balatro-music-loop";
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
  const [trackIndex, setTrackIndex] = useState<number>(() => {
    const stored = localStorage.getItem(TRACK_KEY);
    const index = TRACK_LIST.findIndex((track) => track.id === stored);
    return index >= 0 ? index : 0;
  });
  const [muted, setMuted] = useState<boolean>(
    () => localStorage.getItem(MUTED_KEY) === "true",
  );
  const [volume, setVolume] = useState<number>(getStoredVolume);
  const [playing, setPlaying] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(
    () => localStorage.getItem(LOOP_KEY) === "true",
  );
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const track: Track = TRACK_LIST[trackIndex];
  const isOnLanding = location.pathname === LANDING_PATH;
  const effectivelyMuted = muted || volume === 0;

  //* Reproduce fuera de la Landing, pausa dentro de ella
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isOnLanding) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (!muted && volume > 0) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [isOnLanding, muted, volume, track.src]);

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
      if (!audio || muted || volume === 0 || isOnLanding) return;
      if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => {});
    };
    window.addEventListener("pointerdown", resume);
    return () => window.removeEventListener("pointerdown", resume);
  }, [muted, volume, isOnLanding]);

  //* Aplica bucle al elemento de audio cuando cambia
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = loop;
  }, [loop]);

  //* Al acabar la pista, pasa a la siguiente (loop de playlist)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = (): void => setTrackIndex((prev) => (prev + 1) % TRACK_LIST.length);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [track.src]);

  //* Cambiar de pista: persistir y (si hay que) reproducir
  const selectTrack = (nextIndex: number): void => {
    const index = (nextIndex + TRACK_LIST.length) % TRACK_LIST.length;
    setTrackIndex(index);
    localStorage.setItem(TRACK_KEY, TRACK_LIST[index].id);
  };

  const togglePlay = (): void => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (): void => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTED_KEY, String(next));
      return next;
    });
  };

  const toggleLoop = (): void => {
    setLoop((prev) => {
      const next = !prev;
      localStorage.setItem(LOOP_KEY, String(next));
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

  return (
    <>
      <audio
        ref={audioRef}
        src={track.src}
        key={track.src}
        preload="metadata"
      />
      {!isOnLanding && (
        <>
          <button
            type="button"
            className={styles.mobileTrigger}
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir controles de música"
          >
            {effectivelyMuted ? "🔇" : "🔊"}
          </button>

          <div className={`${styles.controls} ${mobileOpen ? styles.mobileOpen : ""}`}>
            <button
              type="button"
              className={styles.mobileClose}
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar controles de música"
            >
              ✕
            </button>
          <span className={styles.trackTitle}>{track.title}</span>
          <button
            type="button"
            className={styles.button}
            onClick={() => selectTrack(trackIndex - 1)}
            aria-label="Canción anterior"
          >
            ⏮
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={togglePlay}
            aria-label={playing ? "Pausar música" : "Reproducir música"}
          >
            {playing ? "⏸" : "▶"}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => selectTrack(trackIndex + 1)}
            aria-label="Canción siguiente"
          >
            ⏭
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={toggleMute}
            aria-label={effectivelyMuted ? "Activar música" : "Silenciar música"}
          >
            {effectivelyMuted ? "🔇" : "🔊"}
          </button>
          <button
            type="button"
            className={`${styles.button} ${loop ? styles.buttonActive : ""}`}
            onClick={toggleLoop}
            aria-label={loop ? "Desactivar bucle" : "Activar bucle"}
          >
            🔁
          </button>
          <input
            type="range"
            className={styles.slider}
            min={0}
            max={1}
            step={0.01}
            value={effectivelyMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Volumen de la música"
          />
          </div>
        </>
      )}
    </>
  );
}

export default BackgroundMusic;

export interface Track {
  id: string;
  title: string;
  src: string;
}

export const TRACK_LIST: Track[] = [
  { id: "balatro-theme", title: "Balatro Theme", src: "/audio/balatro-theme.mp3" },
  { id: "battle-theme", title: "Battle Theme", src: "/audio/battle_theme.mp3" },
  { id: "seventh-heaven", title: "Seventh Heaven", src: "/audio/seventh_heaven_theme.mp3" },
];

export function getTrackById(id: string): Track | undefined {
  return TRACK_LIST.find((track) => track.id === id);
}

//* Para añadir una canción: copia el mp3 a public/audio/ y añade una línea a TRACK_LIST.
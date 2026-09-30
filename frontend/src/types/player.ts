export type PlayerSong = {
  id: number;
  title: string;
  duration: number;
  audioUrl: string;
  coverUrl: string | null;
  artistNames: string[];
};

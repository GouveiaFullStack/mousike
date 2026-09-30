import type { SongDetails } from "./catalog";

export type HomeSection = {
  type: string;
  title: string;
  description: string;
  songs: SongDetails[];
};

export type HomeData = {
  generatedAt: string;

  personalization: {
    strategy: string;

    basedOn: {
      historyEntries: number;
      favorites: number;
      followedArtists: number;

      topArtists: {
        artistId: number;
        name: string | null;
        score: number;
      }[];

      topGenres: {
        genreId: number;
        name: string | null;
        score: number;
      }[];
    };
  };

  sections: HomeSection[];
};

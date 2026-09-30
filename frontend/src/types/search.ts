export type SearchArtist = {
  id: number;
  name: string;
  imageUrl: string | null;
  bio: string | null;
  verified: boolean;
  createdAt: string;
};

export type SearchSongArtist = {
  songId: number;
  artistId: number;
  role: string;
  artist: SearchArtist;
};

export type SearchGenre = {
  songId: number;
  genreId: number;
  genre: {
    id: number;
    name: string;
  };
};

export type SearchAlbum = {
  id: number;
  title: string;
  coverUrl: string | null;
  releaseDate: string;
  createdAt: string;

  artists: {
    albumId: number;
    artistId: number;

    artist: {
      id: number;
      name: string;
      imageUrl: string | null;
      verified: boolean;
    };
  }[];
};

export type SearchSong = {
  id: number;
  title: string;
  duration: number;
  coverUrl: string | null;
  audioUrl: string;
  createdAt: string;

  albumId: number | null;
  album: {
    id: number;
    title: string;
    coverUrl: string | null;
    releaseDate: string;
    createdAt: string;
  } | null;

  artists: SearchSongArtist[];
  genres: SearchGenre[];
};

export type SearchResponse = {
  query: string;

  results: {
    songs: SearchSong[];
    artists: SearchArtist[];
    albums: SearchAlbum[];
  };

  counts: {
    songs: number;
    artists: number;
    albums: number;
  };
};

export type CatalogArtist = {
  id: number;
  userId: number;
  name: string;
  imageUrl: string | null;
  bio: string | null;
  verified: boolean;
  createdAt: string;
};

export type CatalogAlbum = {
  id: number;
  title: string;
  coverUrl: string | null;
  releaseDate: string;
  createdAt: string;
};

export type CatalogGenreRelation = {
  songId: number;
  genreId: number;
  genre: {
    id: number;
    name: string;
  };
};

export type CatalogSongArtistRelation = {
  songId: number;
  artistId: number;
  role: string;
  artist: CatalogArtist;
};

export type SongDetails = {
  id: number;
  title: string;
  duration: number;
  coverUrl: string | null;
  audioUrl: string;
  createdAt: string;

  albumId: number | null;
  album: CatalogAlbum | null;

  artists: CatalogSongArtistRelation[];
  genres: CatalogGenreRelation[];
};

export type ArtistSong = {
  id: number;
  title: string;
  duration: number;
  coverUrl: string | null;
  audioUrl: string;
  createdAt: string;

  albumId: number | null;
  album: CatalogAlbum | null;

  genres: CatalogGenreRelation[];
};

export type ArtistDetails = CatalogArtist & {
  songs: {
    songId: number;
    artistId: number;
    role: string;
    song: ArtistSong;
  }[];
};

export type AlbumSong = {
  id: number;
  title: string;
  duration: number;
  coverUrl: string | null;
  audioUrl: string;
  createdAt: string;
  albumId: number | null;

  artists: CatalogSongArtistRelation[];
  genres: CatalogGenreRelation[];
};

export type AlbumDetails = CatalogAlbum & {
  artists: {
    albumId: number;
    artistId: number;
    artist: CatalogArtist;
  }[];

  songs: AlbumSong[];
};

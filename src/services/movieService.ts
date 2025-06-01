import { type Movie } from "../types/movie.ts";

import axios from "axios";

export interface GetMovieRes {
  results: Movie[];
  page: number;
  total_pages: number;
}
export const axiosConfig = {
  url: "https://api.themoviedb.org/3/search/movie",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
};
export const fetchMovies = async (
  newQuery: string,
  page: number = 1
): Promise<GetMovieRes> => {
  const res = await axios.get<GetMovieRes>(
    `${axiosConfig.url}?query=${newQuery}&page=${page}`,
    axiosConfig
  );

  return res.data;
};

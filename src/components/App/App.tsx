import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService.ts";
import type { Movie } from "../../types/movie.ts";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";

export default function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const {
    data: movies,
    error,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery<Movie[], Error>({
    queryKey: ["movies", currentSearchQuery],
    queryFn: () => fetchMovies(currentSearchQuery),
    // enabled: !!currentSearchQuery,
  });

  console.log("--- App Component Render ---");
  console.log("currentSearchQuery:", currentSearchQuery);
  console.log("isLoading (from useQuery):", isLoading);
  console.log("isError (from useQuery):", isError);
  // console.log("queryError (from useQuery):", queryError);
  console.log("isFetching (from useQuery):", isFetching);
  console.log("movies (data from useQuery):", movies);
  console.log("movies?.length:", movies?.length);
  console.log("---------------------------");

  const notifyNoMoviesFound = () =>
    toast.error("No movies found for your request.", {
      style: { background: "rgba(125, 183, 255, 0.8)" },
      icon: "ℹ️",
    });
  useEffect(() => {
    console.log("--- useEffect for No Movies Notification ---");
    console.log("isSuccess:", isSuccess);
    console.log("currentSearchQuery (in useEffect):", currentSearchQuery);
    console.log("movies (in useEffect):", movies);
    console.log(
      "movies && movies.length === 0:",
      movies && movies.length === 0
    );
    console.log("------------------------------------------");

    if (isSuccess && currentSearchQuery && movies && movies.length === 0) {
      notifyNoMoviesFound();
    }
  }, [isSuccess, movies, currentSearchQuery]);

  const handleSearch = async (newQuery: string) => {
    console.log("handleSearch called with newQuery:", newQuery);
    setCurrentSearchQuery(newQuery);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies && movies.length > 0 && (
        <MovieGrid onSelect={openModal} movies={movies} />
      )}
      {selectedMovie !== null && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}

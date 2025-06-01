import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies, type GetMovieRes } from "../../services/movieService.ts";
import type { Movie } from "../../types/movie.ts";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import ReactPaginate from "react-paginate";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, isSuccess } = useQuery<GetMovieRes, Error>({
    queryKey: ["movies", currentSearchQuery, currentPage],
    queryFn: () => fetchMovies(currentSearchQuery, currentPage),
    enabled: currentSearchQuery !== "",
    placeholderData: keepPreviousData,
  });

  const movies: Movie[] = data?.results || [];
  const totalPages: number = data?.total_pages ?? 0;

  const notifyNoMoviesFound = () =>
    toast.error("No movies found for your request.", {
      style: { background: "rgba(125, 183, 255, 0.8)" },
      icon: "ℹ️",
    });
  useEffect(() => {
    if (isSuccess && currentSearchQuery && (data?.results || []).length === 0) {
      notifyNoMoviesFound();
    }
  }, [isSuccess, data, currentSearchQuery]);

  const handleSearch = async (newQuery: string) => {
    setCurrentSearchQuery(newQuery);
    setCurrentPage(1);
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
      {movies.length > 0 && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)} // Викликаємо наш обробник
          forcePage={currentPage - 1} // forcePage використовує 0-індексацію
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data?.results && data.results.length > 0 && (
        <MovieGrid onSelect={openModal} movies={data.results} />
      )}
      {selectedMovie !== null && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}

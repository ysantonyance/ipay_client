import {useEffect, useState} from "react";
import {seriesApi} from "../api/seriesApi.js";
import {genresApi} from "../api/genresApi.js";

export const isMovie = s => !s.episodeIds?.length;

function useFilms() {
    const [series, setSeries] = useState([]);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        seriesApi.getAll().then(res => setSeries(res)).catch(console.error);
        genresApi.getAll().then(res => setGenres(res)).catch(console.error);
    }, []);

    return {series, genres};
}

export default useFilms;
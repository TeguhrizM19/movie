import axios from "axios";

const apiKey = process.env.REACT_APP_APIKEY;
const baseUrl = process.env.REACT_APP_BASEURL;

export const listMovie = async (page = 1, perPage = 10) => {
  const movie = await axios.get(`${baseUrl}/movie/popular?page=${page}&per_page=${perPage}&api_key=${apiKey}`);
  // console.log({ movie });
  return movie.data.results;
};

export const searchMovie = async (s, page = 1) => {
  const search = await axios.get(`${baseUrl}/search/movie?query=${s}&page=${page}&api_key=${apiKey}`);
  return search.data;
};

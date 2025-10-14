import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://openlibrary.org",
});

export default axiosInstance;

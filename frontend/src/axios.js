import axios from "axios";

// base url for the database port to use axios libray
export default axios.create({
  baseURL: "https://localhost:3000",
});

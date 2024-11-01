import axios from "axios";

// base url for the database port to use axios libray
export default axios.create({
  baseURL: "http://localhost:3001",
});

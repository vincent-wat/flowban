import axios from "axios";

export const baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

export default axios.create({
  baseURL,
  withCredentials: true 
});


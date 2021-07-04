import axios from 'axios';

export const api = axios.create({
  baseURL: "html://localhost:8080/",
})
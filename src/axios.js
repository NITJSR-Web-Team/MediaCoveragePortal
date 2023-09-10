import axiosOriginal from "axios";

const axios = axiosOriginal.create({
  baseURL: "https://nitjsr.ac.in/backend",
});

export default axios;

import axiosOriginal from "axios";

const axios = axiosOriginal.create({
  baseURL: "http://localhost:3030"
});

export default axios
import Axios from "axios";

const api = Axios.create({
  baseURL: "https://opendata.resas-portal.go.jp/api/v1",
  headers: {
    "X-API-KEY": "s3sasmHfgS971K8ZAQudZZuYpdrx5pVMCBnmW1tR",
  },
});

export const apiData = {
  locations: () => api.get("/prefectures"),
  population: (code) =>
    api.get(`/population/composition/perYear?cityCode=-&prefCode=${code + 1}`),
};

import axios from "axios";

const api = axios.create({
  baseURL: "https://opendata.resas-portal.go.jp/",
  headers: {
    "X-API-KEY": "Zp0ThlAW2efTLOAfvaiXdOBg6fT2XAPw7EAulBrX",
  },
});

export const apiData = {
  location: () => api.get("api/v1/prefectures"),
  population: (code) =>
    api.get(
      `api/v1/population/composition/perYear?cityCode=-&prefCode=${code}`
    ),
};

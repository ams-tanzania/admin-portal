import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://ams.mzugu.me.tz/api/",
    headers: {
        "Content-Type": "application/json",
        
    },
});

export default apiClient;
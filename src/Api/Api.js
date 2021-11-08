// import axios
import axios from "axios";
const Api = axios.create({
  // default endpoint
  //   baseURL: "http://localhost:8080/api",
  baseURL: "http://backend-shop.test/api",
});

export default Api;

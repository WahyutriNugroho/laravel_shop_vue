import Api from "../../Api/Api";

const auth = {
  namespaced: true,

  state: {
    //   state untuk token, pakai local storage menyimpan informasi jwt
    token: localStorage.getItem("token") || "",
    //   state untuk user, pakai local storage menyimpan user yang sedang login
    user: JSON.parse(localStorage.getItem("user")) || {},
  },

  mutations: {
    //   update state token dan state user hasil dari response
    AUTH_SUCCESS(state, token, user) {
      state.token = token;
      state.user = user;
    },

    // Update user dari hasil response register / login
    GET_USER(state, user) {
      state.user = user;
    },

    // Logout
    AUTH_LOGOUT(state) {
      state.token = "";
      state.user = {};
    },
  },

  actions: {
    //action register
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        Api.post("/register", {
          //data yang dikirim ke serve untuk proses register
          name: user.name,
          email: user.email,
          password: user.password,
          password_confirmation: user.password_confirmation,
        })

          .then((response) => {
            //define variable dengan isi hasil response dari server
            const token = response.data.token;
            const user = response.data.user;

            //set localStorage untuk menyimpan token dan data user
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            //set default header axios dengan token
            Api.defaults.headers.common["Authorization"] = "Bearer " + token;

            //commit auth success ke mutation
            commit("AUTH_SUCCESS", token, user);
            commit("GET_USER", user);

            //resolve ke component dengan hasil response
            resolve(response);
          })
          .catch((error) => {
            //jika gagal, remove localStorage dengan key token
            localStorage.removeItem("token");

            //reject ke component dengan hasil response
            reject(error.response.data);
          });
      });
    },
    // Get User
    getUser({ commit }) {
      // ambil data dari LocalStorage
      const token = localStorage.getItem("token");

      Api.defaults.headers.common["Authorization"] = "Bearer" + token;
      Api.get("/user").then((response) => {
        // Commit ke Muttations
        commit("GET_USER", response.data.user);
      });
    },

    // Logout
    logout({ commit }) {
      // define callback promise
      return new Promise((resolve) => {
        commit("AUTH_LOGOUT");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // delete header axios
        delete Api.defaults.headers.common["Authorization"];

        resolve();
      });
    },

    // Login
    login({ commit }, user) {
      // define callback promise
      return new Promise((resolve, reject) => {
        Api.post("/login", {
          email: user.email,
          password: user.password,
        })
          .then((response) => {
            const token = response.data.token;
            const user = response.data.user;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            Api.defaults.headers.common["Authorization"] = "Bearer" + token;

            // commit auth success ke mutation
            commit("AUTH_SUCCESS", token, user);

            // commit auth success ke mutation
            commit("GET_USER", user);

            resolve(response);
          })
          .catch((error) => {
            localStorage.removeItem("token");
            reject(error.response.data);
          });
      });
    },
  },

  getters: {
    //get current user
    currentUser(state) {
      return state.user; // <-- return dengan data user
    },

    isLoggedIn(state) {
      return state.token; // return dengan data token
    },
  },
};

export default auth;

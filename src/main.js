import { createApp } from "vue";
import App from "./App.vue";

// import router
import router from "./router";

// import router
import store from "./store";

const app = createApp(App);

// plugin use untuk menggunakan router
app.use(router);

// plugin use untuk menggunakan router
app.use(store);

// define mixin for global function
app.mixin({
  methods: {
    // money thousand
    moneyFormat(number) {
      let reverse = number.toString().split("").reverse().join(""),
        thounsands = reverse.match(/\d{1,3}/g);
      thounsands = thounsands.join(".").split("").reverse().join("");
      return thounsands;
    },
    // calculate discount
    calculateDiscount(product) {
      return product.price - (product.price * product.discount) / 100;
    },
  },
});

app.mount("#app");

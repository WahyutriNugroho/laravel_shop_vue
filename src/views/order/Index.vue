<template>
  <div class="container-fluid mb-5 mt-4">
    <div class="row">
      <div class="col-md-3 mb-4">
        <CustomerMenu />
      </div>
    </div>
    <div class="col-md-9 mt-2">
      <div class="card border-0 rounded shadow">
        <div class="card-body">
          <h5 class="font-weight-bold">
            <i class="fa fa-shopping-cart">DETAIL ORDER</i>
          </h5>
          <hr />
          <table class="table table-bordered">
            <tr>
              <td style="width: 25%">NO. INVOICE</td>
              <td style="width: 1%">:</td>
              <td>{{ detailOrder.invoice }}</td>
            </tr>
            <tr>
              <td>NAMA LENGKAP</td>
              <td>:</td>
              <td>{{ detailOrder.name }}</td>
            </tr>
            <tr>
              <td>NAMA LENGKAP</td>
              <td>:</td>
              <td>{{ detailOrder.name }}</td>
            </tr>
            <tr>
              <td>N0 TELP/WA</td>
              <td>:</td>
              <td>{{ detailOrder.phone }}</td>
            </tr>
            <tr>
              <td>ALAMAT LENGKAP</td>
              <td>:</td>
              <td>
                {{ detailOrder.address }}
              </td>
            </tr>
            <tr>
              <td>KURIR | SERVICE | COST</td>
              <td>:</td>
              <td>
                {{ detailOrder.courier }} | {{ detailOrder.service }} |
                {{ detailOrder.cost_courier }}
              </td>
            </tr>
            <tr>
              <td>TOTAL PEMBELIAN</td>
              <td>:</td>
              <td>
                {{ detailOrder.grand_total }}
              </td>
            </tr>
            <tr>
              <td>STATUS</td>
              <td>:</td>
              <td>
                <button
                  @click="payment(detailOrder.snap_token)"
                  v-if="detailOrder.status == 'pending'"
                  class="btn btn-primary"
                >
                  BAYAR SEKARANG
                </button>
                <button
                  @click="payment(detailOrder.snap_token)"
                  v-else-if="detailOrder.status == 'success'"
                  class="btn btn-primary"
                >
                  {{ detailOrder.status }}
                </button>
                <button
                  @click="payment(detailOrder.snap_token)"
                  v-else-if="detailOrder.status == 'expired'"
                  class="btn btn-primary"
                >
                  {{ detailOrder.status }}
                </button>
                <button
                  @click="payment(detailOrder.snap_token)"
                  v-else-if="detailOrder.status == 'failed'"
                  class="btn btn-primary"
                >
                  {{ detailOrder.status }}
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="col-md-9 mt-2">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h5 class="font-weight-bold">
              <i class="fa fa-shopping-cart">DETAIL ORDER</i>
            </h5>
            <hr />
            <table
              class="table"
              style="
                border-style: solid !important;
                border-color: rgb(198, 206, 214) !important;
              "
            >
              <tbody>
                <tr
                  v-for="product in productInOrder"
                  :key="product.id"
                  style="background: #edf2f7"
                >
                  <td class="b-none" style="width: 25%">
                    <div class="wrapper-image-cart">
                      <img
                        :src="product.image"
                        style="width: 100%; border-radius: 0.5rem"
                      />
                    </div>
                  </td>
                  <td class="b-none" style="width: 50%">
                    <table
                      class="table table-borderless"
                      style="font-size: 15px"
                    >
                      <tr>
                        <td style="padding: 0.2rem">QTY</td>
                        <td style="padding: 0.2rem">:</td>
                        <td style="padding: 0.2rem">{{ product.qty }}</td>
                      </tr>
                    </table>
                  </td>
                  <td class="b-none text-right">
                    <p class="m-0 font-weight-bold">
                      Rp. {{ moneyFormat(product.price) }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CustomerMenu from "../../components/CustomerMenu.vue";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
  components: { CustomerMenu },
  setup() {
    const store = useStore;
    const route = useRoute;
    const router = useRouter;

    onMounted(() => {
      return store.dispatch("order/detailOrder", route.params.snap_token);
    });
    const detailOrder = computed(() => {
      return store.getters["order/detailOrder"];
    });
    const productInOrder = computed(() => {
      return store.getters["order/productInOrder "];
    });

    // function payment midtrans
    function payment(snap_token) {
      window.snap.pay(snap_token, {
        onSuccess: function () {
          router.push({
            name: "detail_order",
            params: { snap_token: snap_token },
          });
        },
        onPending: function () {
          router.push({
            name: "detail_order",
            params: { snap_token: snap_token },
          });
        },
        onError: function () {
          router.push({
            name: "detail_order",
            params: { snap_token: snap_token },
          });
        },
      });
    }

    return store, detailOrder, route, router, productInOrder, payment;
  },
};
</script>

<style scoped>
.table .thead-dark th {
  color: #ffff;
  background-color: #6777ef;
  border-color: #6777ef;
}
</style>

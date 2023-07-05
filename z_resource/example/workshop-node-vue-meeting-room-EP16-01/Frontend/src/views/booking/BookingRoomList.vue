<template>
    <Layout>
        <Search :types="search_types" @onSearch="onSearch($event)" />
        <div class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'booking-room' }">จองห้องประชุม</router-link>
            <router-link class="btn btn-menu" :to="{ name:'booking-history' }">ประวัติการจอง</router-link>
        </div>

        <div class="card mb-3" v-for="item in rooms.result" :key="item.r_id">
            <div class="row align-items-center">
                <div class="col-sm-4">
                    <img :src="`/api/uploads/${item.r_image}`" :alt="item.r_name" class="img-booking">
                </div>
                <div class="col-sm-8">
                    <div class="card-body">
                        <div>ชื่อห้อง : {{ item.r_name }}</div>
                        <div>ขนาด : {{ item.r_capacity }}</div>
                        <div>รายละเอียด : {{ item.r_detail || 'ไม่มีข้อมูล!' }}</div>
                        <div class="btn-booking">
                            <button @click="onBooking(item)" class="btn btn-info">
                                <i class="fa fa-ticket"></i> จองห้องนี้
                            </button>

                            <button @click="onDetail(item)" class="btn btn-secondary">
                                <i class="fa fa-info"></i> รายละเอียด
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Pagination :data="rooms" :page="page" @onPage="onPage($event)" />
        <BookingDialog :room="roomItem" @onClose="roomItem = null" />
        <BookingDetailDialog :room="roomDetailItem" @onClose="roomDetailItem = null" @onBooking="roomItem = $event" />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import BookingDialog from "./BookingDialog";
import BookingDetailDialog from "./BookingDetailDialog";
import { mapState } from "vuex";
export default {
  components: {
    Layout,
    Search,
    Pagination,
    BookingDialog,
    BookingDetailDialog
  },
  computed: {
    ...mapState(["rooms"])
  },
  data() {
    return {
      search_types: [
        { name: "ชื่อห้อง", value: "r_name" },
        { name: "ขนาด", value: "r_capacity" },
        { name: "รายละเอียด", value: "r_detail" }
      ],
      page: 1,
      search: "",
      roomItem: null,
      roomDetailItem: null
    };
  },
  mounted() {
    this.$store.dispatch("set_booking_rooms");
  },
  methods: {
    // เมื่อมีการคลิกเพื่อดูรายละเอียดของห้องประชุม
    onDetail(item) {
      this.roomDetailItem = item;
    },
    // เมื่อมีการคลิกที่จองห้องนี้ จะแสดงหน้า Modal dialod
    onBooking(item) {
      this.roomItem = item;
    },
    onSearch(search) {
      this.search = search;
      this.$store.dispatch("set_booking_rooms", { page: 1, ...this.search });
    },
    onPage(page) {
      this.page = page;
      this.$store.dispatch("set_booking_rooms", {
        page: this.page,
        ...this.search
      });
    }
  }
};
</script>

<style scoped>
.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-active {
  background-color: #17a2b8;
}
.card {
  color: #525b62;
  border-right: solid 5px #17a2b8;
}
.card-body {
  padding-left: 5px;
}
.img-booking {
  max-width: 100%;
}
.btn-booking .btn {
  margin-right: 10px;
  width: 150px;
  margin-top: 15px;
}

@media (max-width: 575.98px) {
  .btn-booking .btn {
    width: 100%;
  }
  .card-body {
    padding-left: 1.25rem;
  }
}
</style>

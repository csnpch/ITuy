<template>
    <Layout>
        <Search :types="search_types" @onSearch="onSearch($event)" />
        <div class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'booking-room' }">จองห้องประชุม</router-link>
            <router-link class="btn btn-menu" :to="{ name:'booking-history' }">ประวัติการจอง</router-link>
        </div>

         <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <h5><i class="fa fa-list-alt"></i> รายการข้อมูลประวัติการจองห้อง</h5>
                </header>

                <div class="table-responsive">
                  <table class="table">
                      <thead>
                          <tr>
                              <th>#</th>
                              <th>หัวข้อประชุม</th>
                              <th>วัน-เวลาเริ่ม</th>
                              <th>วัน-เวลาสิ้นสุด</th>
                              <th></th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="item of histories.result" :key="item.bk_id" :class="getStatusClass(item)">
                              <td>{{ item.bk_id }}</td>
                              <td>{{ item.bk_title }}</td>
                              <td>{{ item.bk_time_start | date }}</td>
                              <td>{{ item.bk_time_end | date }}</td>
                              <td class="text-right">
                                  <label class="badge badge-warning" v-if="item.bk_status == 'pending'">
                                      <i class="fa fa-hourglass"></i> รอดำเนินการ
                                  </label>

                                  <label class="badge badge-success" v-if="item.bk_status == 'allowed'">
                                      <i class="fa fa-check-square-o"></i> อนุมัติแล้ว
                                  </label>

                                  <label class="badge badge-danger" v-if="item.bk_status == 'not allowed'">
                                      <i class="fa fa-window-close"></i> ไม่อนุมัติ
                                  </label>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                </div>

                <Pagination :page="page" :data="histories" @onPage="onPage($event)" />
            </div>
         </div>
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { mapState } from "vuex";
export default {
  components: {
    Layout,
    Search,
    Pagination
  },
  computed: {
    ...mapState({
      histories: state => state.booking_histories
    })
  },
  data() {
    return {
      search_types: [
        { name: "หัวข้อประชุม", value: "bk_title" },
        { name: "วันที่เริ่ม", value: "bk_time_start", type: "date" },
        { name: "วันที่สิ้นสุด", value: "bk_time_end", type: "date" }
      ],
      page: 1,
      search: {}
    };
  },
  mounted() {
    this.$store.dispatch("set_booking_histories");
  },
  methods: {
    // apply class ให้กับแถวใน Table
    getStatusClass(item) {
      const statusClass = {};
      statusClass[item.bk_status] = true;
      return statusClass;
    },
    // Search filter
    onSearch(search) {
      this.search = search;
      this.$store.dispatch("set_booking_histories", {
        page: 1,
        ...this.search
      });
    },
    // Pagination
    onPage(page) {
      this.page = page;
      this.$store.dispatch("set_booking_histories", {
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
.badge {
  width: 100px;
  border-radius: 0;
  font-weight: 400;
}
.allowed td {
  color: #28a745;
}
.not.allowed td {
  color: #dc3545;
}
</style>

<template>
    <Layout>
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <Search :types="search_types" @onSearch="onSearch($event)" />
                    <h5><i class="fa fa-list-alt"></i> รายการข้อมูลจองห้องประชุม</h5>
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
                          <tr v-for="item in bookings.result" :key="item.bk_id" :class="getApplyStatusClass(item)">
                              <td>{{ item.bk_id }}</td>
                              <td>{{ item.bk_title }}</td>
                              <td>{{ item.bk_time_start | date }}</td>
                              <td>{{ item.bk_time_end | date }}</td>
                              <td class="btns no-wrap">
                                  <div v-if="item.bk_status === 'pending'">
                                      <button @click="onUpdateStatus('allowed', item)" class="btn btn-sm btn-warning mr-2">
                                          <i class="fa fa-check-circle"></i> อนุมัติ
                                      </button>

                                      <button @click="onUpdateStatus('not allowed', item)" class="btn btn-sm btn-danger">
                                          <i class="fa fa-times-circle"></i> ไม่อนุมัติ
                                      </button>
                                  </div>

                                  <div v-if="item.bk_status === 'allowed'">
                                      <i class="fa fa-check-circle"></i> อนุมัติแล้ว
                                  </div>

                                  <div v-if="item.bk_status === 'not allowed'">
                                      <i class="fa fa-times-circle"></i> ไม่อนุมัติ

                                      <button @click="onDelete(item)" class="btn btn-sm btn-danger ml-2">
                                          <i class="fa fa-trash"></i> ลบทิ้ง
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                 </div>

                 <Pagination :data="bookings" :page="page" @onPage="onPage($event)" />
            </div>
        </div>
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { mapState } from "vuex";
import Axios from "axios";
export default {
  components: {
    Layout,
    Search,
    Pagination
  },
  computed: {
    ...mapState(["bookings"])
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
    this.initialLoadBooking();
  },
  methods: {
    // ลบข้อมูลการจอง
    onDelete(item) {
      this.alertify.confirm("คุณต้องการทำรายการต่อไปหรือไม่?", () => {
        Axios.delete(`/api/booking/manage/${item.bk_id}`)
          .then(response => this.initialLoadBooking())
          .catch(error => this.alertify.error(error.response.data.message));
      });
    },
    // เปลี่ยนสถานะการจองห้องประชุม
    onUpdateStatus(bk_status, item) {
      this.alertify.confirm("คุณต้องการทำรายการต่อไปหรือไม่?", () => {
        Axios.put(`/api/booking/manage/${item.bk_id}`, { bk_status })
          .then(response => this.initialLoadBooking())
          .catch(error => this.alertify.error(error.response.data.message));
      });
    },
    // เปลี่ยน สถานะการจองเป็น ชื่อ class
    getApplyStatusClass(item) {
      const statusClass = {};
      statusClass[item.bk_status] = true;
      return statusClass;
    },
    // ค้นหาข้อมูล
    onSearch(search) {
      this.search = search;
      this.$store.dispatch("set_bookings", { page: 1, ...this.search });
    },
    // แบ่งหน้าเพจ
    onPage(page) {
      this.page = page;
      this.$store.dispatch("set_bookings", {
        page: this.page,
        ...this.search
      });
    },
    // โหลดข้อมูลรายการจองห้องประชุม
    initialLoadBooking() {
      this.$store.dispatch("set_bookings");
    }
  }
};
</script>


<style scoped>
.btns {
  width: 200px;
  text-align: right;
}
.btns .btn {
  width: 82px;
}

tr.allowed td {
  color: #28a745;
}

tr.not.allowed td {
  color: #dc3545;
}
</style>


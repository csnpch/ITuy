<template>
    <Layout>
        <div slot="buttons" class="form-group">
            <router-link class="btn" :to="{ name:'equipment-list' }">รายการข้อมูล</router-link>
            <router-link class="btn" :to="{ name:'equipment-form' }">เพิ่มข้อมูลใหม่</router-link>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <Search :types="search_types" @onSearch="onSearch($event)" />
                    <h5><i class="fa fa-list-alt"></i> รายการข้อมูลอุปกรณ์ห้องประชุม</h5>
                </header>

                <div class="table-responsive">
                  <table class="table">
                      <thead>
                          <tr>
                              <th class="d-none d-sm-table-cell">#</th>
                              <th>ชื่ออุปกรณ์ห้องประชุม</th>
                              <th>รายละเอียด</th>
                              <th>วันที่แก้ไขล่าสุด</th>
                              <th></th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="item in equipments.result" :key="item.eq_id">
                              <td class="d-none d-sm-table-cell">
                                  <div class="img-container">
                                      <img :alt="item.eq_name" :src="`/api/uploads/${item.eq_image}`">
                                  </div>
                              </td>
                              <td>{{ item.eq_name }}</td>
                              <td>{{ item.eq_detail || 'ไม่มีข้อมูล' }}</td>
                              <td>{{ item.eq_updated | date }}</td>
                              <td class="text-right no-wrap">
                                  <i @click="onUpdate(item)" class="pointer fa fa-edit text-info mr-3"></i>
                                  <i @click="onDelete(item)" class="pointer fa fa-trash text-danger"></i>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                </div>

                <Pagination :data="equipments" :page="page" @onPage="onPage($event)" />
            </div>
        </div>
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { mapState } from "vuex";
import Axios from "axios";
export default {
  data() {
    return {
      search: {},
      page: 1,
      search_types: [
        { name: "ชื่ออุปกรณ์ห้องประชุม", value: "eq_name" },
        { name: "รายละเอียด", value: "eq_detail" }
      ]
    };
  },
  computed: {
    ...mapState(["equipments"])
  },
  components: {
    Layout,
    Pagination,
    Search
  },
  created() {
    this.$store.dispatch("set_equipments");
  },
  methods: {
    // แก้ไขข้อมูลโดยส่ง id ไปที่หน้า Form create
    onUpdate(item) {
      this.$router.push({ name: "equipment-form", query: { id: item.eq_id } });
    },
    // ลบข้อมูล
    onDelete(item) {
      this.alertify.confirm("คุณต้องการจะลบข้อมูลนี้จริงหรือ?", () => {
        Axios.delete(`/api/equipment/${item.eq_id}`)
          .then(() => this.$store.dispatch("set_equipments"))
          .catch(error => this.alertify.error(error.response.data.message));
      });
    },
    // การแบ่งหน้า Pagination
    onPage(page) {
      this.page = page;
      this.$store.dispatch("set_equipments", {
        page: this.page,
        ...this.search
      });
    },
    // การค้นหาข้อมูล Filter
    onSearch(search) {
      this.search = search;
      this.page = 1;
      this.$store.dispatch("set_equipments", {
        page: this.page,
        ...this.search
      });
    }
  }
};
</script>

<style  scoped>
.btn {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-active {
  background-color: #17a2b8;
}
</style>



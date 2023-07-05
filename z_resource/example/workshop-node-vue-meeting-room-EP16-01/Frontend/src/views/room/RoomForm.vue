<template>
    <Layout>
        <div slot="buttons" class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'room-list' }">รายการข้อมูล</router-link>
            <router-link class="btn btn-menu" :to="{ name:'room-form' }">เพิ่มข้อมูลใหม่</router-link>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <header>
                    <h5><i class="fa fa-edit"></i> เพิ่ม/แก้ไข ข้อมูลอุปกรณ์ห้องประชุม</h5>
                </header>
                <hr>
                
                <form @submit.prevent="onSubmit()">
                    <div class="form-group">
                        <label for="">ชื่อห้องประชุม</label>
                        <input type="text" name="r_name"
                            v-model.trim="form.r_name" 
                            v-validate="{ required: true }"
                            :class="{ 'is-invalid': errors.has('r_name') }"
                            class="form-control">
                        <p class="invalid-feedback">{{ errors.first('r_name') }}</p>
                    </div>

                    <div class="form-group">
                        <label for="">ขนาดความจุ (คน)</label>
                        <input type="number" name="r_capacity"
                            v-model.trim="form.r_capacity" 
                            v-validate="{ required: true }"
                            :class="{ 'is-invalid': errors.has('r_capacity') }"
                            class="form-control">
                        <p class="invalid-feedback">{{ errors.first('r_capacity') }}</p>
                    </div>

                    <div class="form-group">
                        <label for="">รายละเอียด</label>
                        <textarea class="form-control" v-model.trim="form.r_detail" rows="4"></textarea>
                    </div>

                    <div class="form-group">
                        <label class="btn btn-secondary btn-block">
                            <i class="fa fa-upload"></i> อัพโหลดภาพ
                            <input type="file" class="d-none" @change="onChangeFile($event.target)">
                        </label>

                        <img class="img-fluid" :src="form.r_image || '/img/no-image.png'" alt="image example">
                    </div>

                    <div class="form-group mt-4 mb-5">
                        <div class="row">
                            <div class="col-sm-6">
                                <button type="submit" class="btn btn-info btn-block mb-2">
                                    บันทึกข้อมูล
                                </button>
                            </div>
                            <div class="col-sm-6">
                                <router-link :to="{ name: 'room-list' }" class="btn btn-danger btn-block mb-2">
                                    ยกเลิก
                                </router-link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Axios from "axios";
export default {
  components: {
    Layout
  },
  data() {
    return {
      form: {
        r_name: "",
        r_image: "",
        r_capacity: "",
        r_detail: ""
      }
    };
  },
  mounted() {
    this.initialUpdateItem();
  },
  watch: {
    "$route.query.id"() {
      this.form = {
        r_name: "",
        r_image: "",
        r_capacity: "",
        r_detail: ""
      };
      this.$validator.reset();
    }
  },
  methods: {
    // ส่งข้อมูลไปยัง Backend
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (!valid) return;
        if (this.jquery.trim(this.form.r_image) == "")
          return this.alertify.warning("กรุณาอัพโหลดภาพ");
        // ตรวจสอบว่าเป็น การแก้ไขหรือการเพิ่มใหม่
        const updateId = this.$router.currentRoute.query.id;
        const request = isNaN(updateId)
          ? Axios.post("/api/room", this.form) // สร้างใหม่
          : Axios.put(`/api/room/${updateId}`, this.form); // แก้ไข
        // ส่งข้อมูลไปหา Server
        request
          .then(res => this.$router.push({ name: "room-list" }))
          .catch(error => this.alertify.error(error.response.data.message));
      });
    },
    // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
    onChangeFile(input) {
      this.form.r_image = "";
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type.indexOf("image/") >= 0) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.form.r_image = reader.result;
          });
          return;
        }
      }
      this.alertify.warning("กรุณาเลือกภาพที่จะอัพโหลด !");
    },
    // นำข้อมูลจาก Server ไปใส่ใน Form เพื่อทำการ update ใหม่
    initialUpdateItem() {
      const id = this.$route.query.id;
      if (isNaN(id)) return;
      Axios.get(`/api/room/${id}`)
        .then(res => {
          const form = res.data;
          this.form.r_name = form.r_name;
          this.form.r_capacity = form.r_capacity;
          this.form.r_image = form.r_image;
          this.form.r_detail = form.r_detail;
        })
        .catch(() => this.$router.push({ name: "room-list" }));
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
.btn.router-link-exact-active {
  background-color: #17a2b8;
}
form {
  max-width: 350px;
  margin: auto;
}
form img {
  border: solid 1px #6c757d;
}
</style>


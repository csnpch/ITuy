<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="booking-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" @submit.prevent="onSubmit()">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fa fa-ticket"></i> จองห้องประชุมนี้
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label for="">หัวข้อที่จะประชุม</label>
                        <input type="text" name="bk_title"
                            v-model.trim="form.bk_title"
                            v-validate="{ required: true }"
                            :class="{ 'is-invalid': errors.has('bk_title') }"
                            class="form-control">
                        <p class="invalid-feedback">{{ errors.first('bk_title') }}</p>
                    </div>

                    <div class="form-group">
                        <label for="">รายละเอียดอื่นๆ</label>
                        <textarea 
                            v-model.trim="form.bk_detail"
                            class="form-control" rows="4"></textarea>
                    </div>

                    <div class="row">
                        <div class="col-sm-7">
                            <div class="form-group">
                                <label for="">เริ่มประชุมวันที่</label>
                                <input type="date" name="bk_time_start_date"
                                    v-validate="{ required: true }"
                                    :class="{ 'is-invalid': errors.has('bk_time_start_date') }"
                                    v-model="form.bk_time_start.date"
                                    class="form-control">
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="form-group">
                                <label for="">เวลา</label>
                                <input type="time" name="bk_time_start_time"
                                    v-validate="{ required: true }"
                                    :class="{ 'is-invalid': errors.has('bk_time_start_time') }"
                                    v-model="form.bk_time_start.time"
                                    class="form-control">
                            </div>
                        </div>

                        <div class="col-sm-7">
                            <div class="form-group">
                                <label for="">สิ้นสุดประชุมวันที่</label>
                                <input type="date" name="bk_time_end_date"
                                    v-validate="{ required: true }"
                                    :class="{ 'is-invalid': errors.has('bk_time_end_date') }"
                                    v-model="form.bk_time_end.date"
                                    class="form-control">
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="form-group">
                                <label for="">เวลา</label>
                                <input type="time" name="bk_time_end_time"
                                    v-validate="{ required: true }"
                                    :class="{ 'is-invalid': errors.has('bk_time_end_time') }"
                                    v-model="form.bk_time_end.time"
                                    class="form-control">
                            </div>
                        </div>
                    </div>

                    <div class="form-group mt-2">
                        <label for="">อุปกร์สำหรับห้องประชุม</label>
                        <div class="form-row">
                            <div class="col-sm-4" v-for="(item, index) in equipments" :key="item.eq_id">
                                <div class="form-check" :title="item.eq_name">
                                    <label class="form-check-label">
                                        <input type="checkbox" 
                                            :true-value="item"
                                            v-model="form.equipments[index]"
                                            class="form-check-input"> {{ item.eq_name }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="img-equipment" 
                            :style="{ 'background-image': `url(/api/uploads/${item.eq_image})` }"
                            :key="item.eq_id" v-for="item in equipmentsItems"></div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-info btn-block mt-2 mb-4">จองห้องประชุมนี้</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Axios from "axios";
export default {
  props: {
    room: {
      required: true
    }
  },
  watch: {
    room(value) {
      if (!value) return;
      this.jquery("#booking-dialog").modal();
      this.form.tb_rooms_r_id = value.r_id;
    }
  },
  computed: {
    equipmentsItems() {
      const equipments = this.form.equipments;
      if (equipments && equipments.length > 0)
        return equipments.filter(item => item);
      return [];
    }
  },
  data() {
    return {
      equipments: [],
      form: {
        tb_rooms_r_id: "",
        bk_title: "",
        bk_detail: "",
        bk_time_start: {
          date: "",
          time: ""
        },
        bk_time_end: {
          date: "",
          time: ""
        },
        equipments: []
      }
    };
  },
  mounted() {
    // ตรวจจับ Event การปิดหน้า Modal dialog
    this.jquery("#booking-dialog").on("hide.bs.modal", event => {
      this.$emit("onClose", event);
    });

    // ดึงข้อมูลอุปกรณ์ห้องประชุม
    this.initialLoadEquipments();
  },
  methods: {
    // บันทึกข้อมูล
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (!valid) return;
        const requestData = { ...this.form };
        requestData.bk_time_start = this.onMergeDatetime(
          requestData.bk_time_start
        );
        requestData.bk_time_end = this.onMergeDatetime(requestData.bk_time_end);
        requestData.equipments = this.equipmentsItems.map(item => item.eq_id);
        // ส่งข้อมูลไปยัง Server
        Axios.post("/api/booking", requestData)
          .then(response => {
            this.onReset();
            this.jquery("#booking-dialog").modal("hide");
          })
          .catch(err => this.alertify.error(err.response.data.message));
      });
    },
    // ดึงข้อมูลอุปกรณ์ห้องประชุม
    initialLoadEquipments() {
      Axios.get("/api/booking/equipments")
        .then(response => (this.equipments = response.data))
        .catch(err => this.alertify.error(err.response.data.message));
    },
    // รวมวันที่กับเวลาเข้าด้วยกัน
    onMergeDatetime({ date, time }) {
      const datetime = new Date(date);
      const [hours, minute] = time.split(":");
      datetime.setHours(hours, minute);
      return datetime;
    },
    // ล้างข้อมูลจาก Form
    onReset() {
      this.$validator.reset();
      this.form = {
        tb_rooms_r_id: "",
        bk_title: "",
        bk_detail: "",
        bk_time_start: {
          date: "",
          time: ""
        },
        bk_time_end: {
          date: "",
          time: ""
        },
        equipments: []
      };
    }
  }
};
</script>

<style scoped>
.modal {
  color: #525b62;
}
.modal-body,
.modal-footer {
  padding-left: 8%;
  padding-right: 8%;
}
.form-check {
  margin-bottom: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.img-equipment {
  width: 100px;
  height: 70px;
  border: solid 1px #d0d0d0;
  display: inline-block;
  margin: 1px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>


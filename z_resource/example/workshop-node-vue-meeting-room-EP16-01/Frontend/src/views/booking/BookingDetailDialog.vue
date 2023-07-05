<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="booking-detail-dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fa fa-info"></i> รายละเอียดของห้องประชุม
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body" v-if="roomItem">
                   
                   <div class="form-group">
                     <img class="img-fluid"
                      :src="`/api/uploads/${roomItem.r_image}`" 
                      :alt="roomItem.r_name">
                   </div>

                   <div class="row black mt-4">
                     <div class="col-sm-4 form-group">ชื่อห้อง</div>
                     <div class="col-sm-8 form-group">: {{ roomItem.r_name }}</div>
                   </div>

                   <div class="row">
                     <div class="col-sm-4 form-group">ขนาดความจุ</div>
                     <div class="col-sm-8 form-group">: {{ roomItem.r_capacity }} คน</div>
                   </div>

                   <div class="row">
                     <div class="col-sm-4 form-group">การจอง</div>
                     <div class="col-sm-8 form-group">: มีการจอง {{ roomItem.r_booking }} การจอง</div>
                   </div>

                   <div class="row">
                     <div class="col-sm-4 form-group">รายละเอียด</div>
                     <div class="col-sm-8 form-group">: {{ roomItem.r_detail || 'ไม่มีข้อมูล !' }}</div>
                   </div>

                </div>

                <div class="modal-footer">
                    <button @click="onBooking()" class="btn btn-info btn-block mt-2 mb-4">
                      จองห้องประชุมนี้
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Axios from "axios";
const modalID = "#booking-detail-dialog";
export default {
  props: {
    room: {
      required: true
    }
  },
  watch: {
    room(value) {
      if (!value) return;
      // ส่งข้อมูลไป r_id ไปทำการค้นหารายละเอียดห้องประชุม
      Axios.get(`/api/booking/room/${value.r_id}`)
        .then(response => {
          this.jquery(modalID).modal();
          this.roomItem = response.data;
        })
        .catch(err => {
          this.alertify.error(err.response.data.message);
        });
    }
  },
  data() {
    return {
      roomItem: null
    };
  },
  mounted() {
    // ตรวจจับ Event การปิดหน้า Modal dialog
    this.jquery(modalID).on("hide.bs.modal", event => {
      this.$emit("onClose", event);
    });
  },
  methods: {
    onBooking() {
      this.jquery(modalID).modal("hide");
      const room = { ...this.room };
      setTimeout(() => {
        this.$emit("onBooking", room);
      }, 500);
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
.img-fluid {
  border: solid 1px #6c757d;
}
.black {
  color: #212529;
}
</style>


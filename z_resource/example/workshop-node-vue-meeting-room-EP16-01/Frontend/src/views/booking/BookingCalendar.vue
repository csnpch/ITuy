<template>
    <Layout>
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <form @submit.prevent="onSearch()" class="search-form form-inline">
                        <select class="form-control" v-model="roomId">
                            <option value="">เลือกห้องประชุม</option>
                            <option :value="item.r_id" v-for="item in roomItems" :key="item.r_id">
                                {{ item.r_name }}
                            </option>
                        </select>

                        <button type="submit" class="btn btn-secondary">
                            <i class="fa fa-search"></i>
                        </button>
                    </form>
                    <h5><i class="fa fa-list-alt"></i> ปฏิทินรายการจองห้องประชุม</h5>
                </header>
                <br>

                <div class="fullcarlendar" id='calendar'></div>
            </div>
        </div>
    </Layout>
</template>

<script>
import Axios from "axios";
import Layout from "@/components/Layout";
const calendarId = "#calendar";
export default {
  components: {
    Layout
  },
  data() {
    return {
      roomId: "",
      roomItems: []
    };
  },
  mounted() {
    this.initialLoadRoomSelect();
    this.initialLoadCalendar();
  },
  methods: {
    // ส่งข้อมูลห้องไปหาข้อมูลการจอง
    onSearch() {
      // ล้างข้อมูล Events
      this.jquery(calendarId).fullCalendar("removeEvents");

      if (!this.jquery.isNumeric(this.roomId))
        return this.alertify.warning("Please select item");

      // ส่งข้อมูลห้องไปค้นหาการจอง
      Axios.get(`/api/booking/calendar/room/${this.roomId}`)
        .then(response => {
          const events = response.data.map(item => {
            return {
              title: item.bk_title,
              start: new Date(item.bk_time_start),
              end: new Date(item.bk_time_end),
              className: item.bk_status
            };
          });
          // กำหนด Events ให้กับ Calendar
          this.jquery(calendarId).fullCalendar("renderEvents", events);
        })
        .catch(err => this.alertify.warning(err.response.data.message));
    },
    // โหลดข้อมูลห้องประชุมมาแสดงใน Select
    initialLoadRoomSelect() {
      Axios.get("/api/booking/rooms/select")
        .then(response => (this.roomItems = response.data))
        .catch(err => this.alertify.warning(err.response.data.message));
    },
    // โหลดข้อมูล Calendar ของ UI
    initialLoadCalendar() {
      this.jquery(calendarId).fullCalendar({
        locale: "th",
        header: {
          left: "prev,next today",
          center: "title",
          right: "month,agendaWeek,agendaDay"
        },
        buttonText: {
          today: "วันนี้",
          month: "เดือน",
          week: "สัปห์ดา",
          day: "วันที่"
        }
      });
    }
  }
};
</script>

<style scoped>
.search-form {
  float: right;
  margin-bottom: 15px;
}
.form-control {
  margin-right: 5px;
}
.form-control:first-child {
  width: 270px;
}
#calendar {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 60px;
}

@media (max-width: 575.98px) {
  .form-control {
    margin-right: 2%;
  }
  .form-control:first-child {
    width: 80%;
  }
  .btn-secondary {
    width: 18%;
  }
  #calendar {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 60px;
  }
}
</style>

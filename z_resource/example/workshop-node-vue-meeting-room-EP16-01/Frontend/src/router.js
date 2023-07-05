import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register'
import Login from './views/Login'
import EquipmentList from './views/equipment/EquipmentList'
import EquipmentForm from './views/equipment/EquipmentForm'
import RoomList from './views/room/RoomList'
import RoomForm from './views/room/RoomForm'
import BookingRoomList from './views/booking/BookingRoomList'
import BookingHistoryList from './views/booking/BookingHistoryList'
import BookingCalendar from './views/booking/BookingCalendar'
import BookingManageList from './views/booking/BookingManageList'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'home', component: Home, meta: { auth: true } },

    // For Equipments
    { path: '/equipment', name: 'equipment-list', component: EquipmentList, meta: { auth: ['admin'] } },
    { path: '/equipment/form', name: 'equipment-form', component: EquipmentForm, meta: { auth: ['admin'] } },

    // For Rooms
    { path: '/room', name: 'room-list', component: RoomList, meta: { auth: ['admin'] } },
    { path: '/room/form', name: 'room-form', component: RoomForm, meta: { auth: ['admin'] } },

    // For Bookings
    { path: '/booking/room', name: 'booking-room', component: BookingRoomList, meta: { auth: true } },
    { path: '/booking/history', name: 'booking-history', component: BookingHistoryList, meta: { auth: true } },
    { path: '/booking/calendar', name: 'booking-calendar', component: BookingCalendar, meta: { auth: ['admin'] } },
    { path: '/booking/manage', name: 'booking-manage', component: BookingManageList, meta: { auth: ['admin'] } },

    { path: '/register', name: 'register', component: Register },
    { path: '/login', name: 'login', component: Login }
  ]
})

// ตรวจสอบสิทธิ์การเข้าถึงหน้า
router.beforeEach((to, from, next) => {
  const auth = to.meta.auth;
  if (!auth) return next();
  router.app.$store.dispatch('get_user_login')
    .then(() => {
      if (!Array.isArray(auth)) return next();
      const userLogin = router.app.$store.state.user;
      if (auth.indexOf(userLogin.u_role) >= 0) return next();
    })
    .catch(() => next({ name: 'login' }));
})

export default router;
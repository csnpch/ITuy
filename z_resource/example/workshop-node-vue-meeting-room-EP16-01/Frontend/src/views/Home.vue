<template>
  <div class="home"></div> 
</template>

<script>
import Layout from "../components/Layout";
export default {
  name: "home",
  components: {
    Layout
  },
  created() {
    const userLogin = this.$store.state.user;
    // หากเป็น User ที่เป็น Admin
    if (userLogin && userLogin.u_role === "admin") {
      this.$router.push({ name: "booking-calendar" });
    } else {
      // หากเป็น User ธรรมดา
      this.$router.push({ name: "booking-room" });
    }
  }
};
</script>

<template>
    <div class="register">
        <img src="/img/logo.svg" alt="Logo" class="img-logo">
        <div class="card">
            <h1 class="card-header">
                REGISTER
            </h1>
            <div class="card-body">
                <form @submit.prevent="onSubmit()">
                    <div class="form-group">
                        <label for="">ชื่อผู้ใช้งาน</label>
                        <input type="text" name="u_username"
                            v-validate="{ required: true, regex: /^[A-Za-z0-9]{6,15}$/ }"
                            v-model.trim="form.u_username"
                            :class="{ 'is-invalid': errors.has('u_username') }"
                            class="form-control">
                        <span class="invalid-feedback">{{ errors.first('u_username') }}</span>
                    </div>

                    <div class="form-group">
                        <label for="">รหัสผ่าน</label>
                        <input type="password" name="u_password"
                            v-validate="{ required: true, regex: /^[A-Za-z0-9]{6,15}$/ }"
                            v-model.trim="form.u_password"
                            :class="{ 'is-invalid': errors.has('u_password') }"
                            class="form-control">
                        <span class="invalid-feedback">{{ errors.first('u_password') }}</span>
                    </div>

                    <div class="form-group">
                        <label for="">ชื่อ</label>
                        <input type="text" name="u_firstname"
                            v-validate="'required'"
                            v-model.trim="form.u_firstname"
                            :class="{ 'is-invalid': errors.has('u_firstname') }"
                            class="form-control">
                        <span class="invalid-feedback">{{ errors.first('u_firstname') }}</span>
                    </div>

                    <div class="form-group">
                        <label for="">นามสกุล</label>
                        <input type="text" name="u_lastname"
                            v-validate="'required'"
                            v-model.trim="form.u_lastname"
                            :class="{ 'is-invalid': errors.has('u_lastname') }"
                            class="form-control">
                        <span class="invalid-feedback">{{ errors.first('u_lastname') }}</span>
                    </div>

                    <div v-if="errorMessage" class="alert alert-warning text-center">
                        {{ errorMessage }}
                    </div>

                    <div class="form-group buttons">
                        <button type="submit" class="btn btn-info btn-block">
                            ลงทะเบียน
                        </button>

                        <button type="button" @click="onRedirectToLogin()" class="btn btn-secondary btn-block">
                            เข้าสู่ระบบ
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        u_username: "",
        u_password: "",
        u_firstname: "",
        u_lastname: ""
      },
      errorMessage: ""
    };
  },
  methods: {
    // บันทึกข้อมูลลงทะเบียน
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (!valid) return;
        axios
          .post("api/account/register", this.form)
          .then(response => {
            this.onReset();
            this.onRedirectToLogin();
          })
          .catch(err => (this.errorMessage = err.response.data.message));
      });
    },
    // ล้างค่า Form
    onReset() {
      this.errorMessage = null;
      this.$validator.reset();
      this.form = {
        u_username: "",
        u_password: "",
        u_firstname: "",
        u_lastname: ""
      };
    },
    // ไปที่หน้าเข้าสู่ระบบ
    onRedirectToLogin() {
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style scoped>
.register {
  max-width: 500px;
  margin: 3% auto;
}
.img-logo {
  width: 85%;
  display: block;
  margin: auto;
  margin-bottom: 30px;
}
h1 {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 5px;
}
.card-body {
  padding-left: 15%;
  padding-right: 15%;
}
.buttons .btn-secondary {
  margin-top: 20px;
}
.buttons {
  margin-top: 30px;
  margin-bottom: 50px;
}

@media (max-width: 575.98px) {
  .card-body {
    padding-left: 15px;
    padding-right: 15px;
  }
  .register {
    padding-left: 10px;
    padding-right: 10px;
  }
  .img-logo {
    width: 100%;
  }
}
</style>



<template>
    <form @submit.prevent="onSearch()" class="search-form form-inline">
        <select class="form-control" v-model="form.search_key">
            <option v-for="item in types" :key="item.value" :value="item.value">
                ค้นหาจาก{{ item.name }}
            </option>
        </select>

        <input :type="getInputType" class="form-control" v-model.trim="form.search_text" placeholder="ค้นหาข้อมูล">

        <button type="submit" class="btn btn-secondary">
            <i class="fa fa-search"></i>
        </button>
    </form>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      required: true
    }
  },
  computed: {
    // เปลี่ยนค่า type ให้กับ input
    getInputType() {
      const findType = this.types.find(
        type => type.value == this.form.search_key
      );
      if (findType && findType.type) return findType.type;
      return "text";
    }
  },
  data() {
    return {
      form: {
        search_key: "",
        search_text: ""
      }
    };
  },
  mounted() {
    if (this.types && this.types.length > 0) {
      this.form.search_key = this.types[0].value;
    }
  },
  methods: {
    onSearch() {
      this.$emit("onSearch", this.form);
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
  width: 140px;
}
.form-control:nth-child(2) {
  width: 200px;
}

@media (max-width: 575.98px) {
  .form-control {
    margin-right: 0;
  }
  .form-control:first-child {
    width: 100%;
    margin-bottom: 3px;
  }
  .form-control:nth-child(2) {
    width: 80%;
  }
  button {
    margin-left: 2%;
    width: 18%;
  }
}
</style>


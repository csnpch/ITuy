<template>
    <div class="layout">
        <Navbar />
        <div class="container">
            <slot name="buttons"></slot>
            <div class="row">
                <div class="col-lg-9">
                    <slot></slot>
                </div>
                <div class="col-lg-3">
                    <Sidebar />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
export default {
  components: {
    Navbar,
    Sidebar
  }
};
</script>


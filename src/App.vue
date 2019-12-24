<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "app"
};
</script>

<style lang='scss'>
@import "@/assets/style/common.scss";
#app {
    width: 100%;
    height: 100%;
    background-color: #e5e5e5;
}
</style>

<template>
    <div id="app">
        <transition name="router-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {};
</script>

<style lang='scss'>
@import "@/assets/style/common.scss";
#app {
    width: 100%;
    height: 100%;
    background-color: #e5e5e5;
}
.router-fade-enter-active,
.router-fade-leave-active {
    transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
    opacity: 0;
}
</style>

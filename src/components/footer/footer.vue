<template>
    <van-tabbar v-model="active">
        <van-tabbar-item icon="home-o" to="/home" name="/home">首页</van-tabbar-item>
        <van-tabbar-item icon="balance-list-o" to="/order" name="/order">订单</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/user/main" name="/user/main">我的</van-tabbar-item>
    </van-tabbar>
</template>

<script>
export default {
    data() {
        return {
            active: this.$route.path
        };
    }
};
</script>

<style lang="scss" scoped>
.active {
    color: #01a3f8;
}
</style>
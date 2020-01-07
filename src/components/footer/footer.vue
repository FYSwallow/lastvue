<template>
    <van-tabbar v-model="active">
        <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
        <van-tabbar-item icon="search" dot to="/search">发现</van-tabbar-item>
        <van-tabbar-item icon="balance-list-o" info="5" to="/blance">订单</van-tabbar-item>
        <van-tabbar-item icon="setting-o" info="20" to="/user">我的</van-tabbar-item>
    </van-tabbar>
</template>

<script>
export default {
    data() {
        return {
            active: 0
        };
    },
    methods: {

    }
};
</script>

<style>
</style>
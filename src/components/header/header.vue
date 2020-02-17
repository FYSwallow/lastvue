<template>
    <div class="header">
        <div class="header-left">
            <van-icon name="arrow-left" />
            <span>返回</span>
        </div>
        <div class="header-middle">{{middleText}}</div>
    </div>
</template>

<script>
export default {
    props: ["middleText"]
};
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #fff;
    background-color: #01a3f8;

    .header-left {
        padding-left: 10px;
    }
    .header-middle {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
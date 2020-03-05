<template>
  <div class="star">
    <div class="rating-star-white">★★★★★</div>
    <div class="rating-star-orange" :style="'width:' +rating / 5 * 48+ 'px' ">★★★★★</div>
  </div>
</template>

<script>
export default {
  props: ["rating"]
};
</script>

<style lang="scss" scoped>
.star {
  position: relative;
  width: 48px;
  .rating-star-white {
    color: #999;
  }
  .rating-star-orange {
    position: absolute;
    top: 0;
    left: 0;
    color: #ff9a0d;
    overflow: hidden;
  }
}
</style>
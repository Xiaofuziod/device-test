<template>
    <div class="header">
        <img src="../assets/banner.png" class="headset-img" alt="">
        <div class="head-title">{{title}}</div>
        <span class="el-icon-close right-icon guan-bi" @click="shutDown"></span>
    </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '设备检测',
      }
    },
    data () {
      return {
        tips: '如果不可以看到自己请尝试切换摄像头。',
      }
    },
    methods: {
      shutDown () {
        this.$emit('close')
      }
    }
  }
</script>
<style scoped lang="scss">

    .header {
        width: 100%;
        min-height: 120px;
        position: relative;
    }

    .headset-img {
        width: 100%;
        max-width: 1200px;
    }

    .head-title {
        width: 200px;
        height: 45px;
        font-size: 28px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 40px;
        transform: translateX(-50%);
    }

    .guan-bi {
        position: absolute;
        right: 13px;
        top: 13px;
        font-size: 20px;
        cursor: pointer;
        line-height: 13px;
        color: #fff;

        &:hover {
            color: #3C4043;
        }

    }
</style>

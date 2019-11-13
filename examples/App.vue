<template>
    <div id="app">
        <div>
            <button style="padding: 5px 10px" @click="open">打开设备测试</button>
        </div>
        <device-test :visible.sync="visible" :config="cfg"/>
    </div>
</template>

<script>
  import Vue from 'vue'
  import Test from '../packages/index'

  Vue.use(Test)
  export default {
    name: 'app',
    data () {
      return {
        visible: false,
        cfg: {
          type: 'http',
          path: 'https://yixue-test.oss-cn-shanghai.aliyuncs.com/test.mp3'
        }
      }
    },
    methods: {
      open () {
        this.visible = true
      }
    }
  }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>

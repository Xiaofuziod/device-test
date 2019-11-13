<template>
    <div>
        <Head @close="close" title="摄像头测试"/>
        <div class="pages-body">
            <MSelect type="video" title="摄像头" @medioId="openDevice" :tips="tips" @clean="cleanStream"/>
            <div>
                <video ref="testCamera" src="" width="300" height="225" style="background-color: #EDEDED"></video>
            </div>
            <div id="next_area" v-if="is_show">
                <div class="tips red">
                    <p>能否看到自己的摄像头画面？</p>
                </div>
                <div class="btn-area">
                    <a class="btn btn-success" href="javascript:;" @click="onBtnNext('1')">可以</a>
                    <a class="btn btn-fail" href="javascript:;" @click="onBtnNext('0')">不可以</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import Head from './head'
  import MSelect from './select'
  import * as util from '../script/util'

  export default {
    components: {
      Head,
      MSelect
    },
    data () {
      return {
        tips: '如果不可以看到自己请尝试切换摄像头。',
        is_show: false,
        stream: null
      }
    },
    mounted () {
      setTimeout(() => {
        this.is_show = true
      }, 3000)
    },
    methods: {
      // 销毁视频对象
      cleanStream () {
        util.disposeVideo(this.stream, () => {
        })
      },
      // 下一步，并且提交测试报告
      onBtnNext (val) {
        this.$emit('setReport', {type: 'video', value: val})
        util.disposeVideo(this.stream, () => {
          this.$emit('next', 'audioCom')
        })
      },
      openDevice (devices) {
        let opt = {
          video: (devices === 'default') ? true : {deviceId: devices}
        }
        navigator.mediaDevices.getUserMedia(opt).then(stream => {
          this.stream = stream
          let videoDom = this.$refs.testCamera
          try {
            videoDom.src = window.URL.createObjectURL(stream)
          } catch (e) {
            videoDom.srcObject = stream
          }
          videoDom.autoplay = true
        }).catch((err) => {
          console.log(err.name)
          if (err.name === 'NotAllowedError') {
            this.tips = '未获取设备权限，请在设置中修改此应用权限。'
            console.log(this.tips)
          } else {
            this.tips = '请检测摄像头是否正常。'
          }
        })
      },
      close () {
        util.disposeVideo(this.stream, () => {
          this.$emit('close')
        })
      }
    }
  }
</script>
<style lang="scss">
    .pages-body {
        width: 750px;
        min-height: 450px;
        text-align: center;
        margin: 0 auto;
        position: relative;
        z-index: 1
    }

    .tips p {
        padding: 10px 0;
        line-height: 1;
    }

    .tips {
        font-size: 14px;
        color: #444
    }

    .tips.red {
        color: #FD714D;
    }

    .btn-area {
        text-align: center;
        margin: 10px
    }

    .btn-area .btn {
        width: 120px;
        height: 30px;
        border-radius: 3px;
        display: inline-block;
        line-height: 30px;
        text-decoration: none;
        font-size: 14px;
        color: #FFFFFF;
    }

    .btn-area .btn-success {
        background-color: #159CF1;
        margin-right: 63px;
    }

    .btn-area .btn-success:hover {
        background-color: #168DD8;
    }

    .btn-area .btn-fail, .btn-area .btn-restart {
        background-color: #F5A623;
    }

    .btn-area .btn-fail:hover, .btn-area .btn-restart:hover {
        background-color: #E0951A;
    }

    .btn-area .btn-close {
        background-color: #8dc453
    }

    .btn-area .btn-close:hover {
        background-color: #5ea414
    }

    .btn-area .btn-skip {
        color: #fff;
        font-size: 1pc;
        border: 1px solid transparent
    }

    .btn-area .btn-skip:hover {
        border-color: #fff
    }

    .btn-area .skiplink {
        color: #999;
        margin-top: 50px;
        display: inline-block
    }
</style>

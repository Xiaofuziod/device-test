<template>
    <div>
        <Head title="麦克风测试" @close="close"/>
        <div class="pages-body">
            <MSelect type="audio" @medioId="openDevice" title="麦克风" :tips="tips" @clean="cleanStream"/>
            <div class="microphone-box">
                <p>请说话：“我正在测试麦克风”</p>
                <div class="microphone-bar">
                    <div class="progress" ref="volumeBar" style="width:15%"></div>
                </div>
            </div>
            <div id="next_area" v-if="is_show">
                <div class="tips red">
                    <p>能否看到颜色条跳动，听到自己声音或麦克风啸叫声？</p>
                    <p style="color: #007777">(若无法听到声音，看见跳动，请选择其他麦克风尝试)</p>
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
        tips: '如果不能听见请切换麦克风。',
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
      // 销毁音频
      cleanStream () {
        util.dispose(this.stream, () => {
        })
      },
      // 下一步，并且提交测试报告
      onBtnNext (val) {
        this.$emit('setReport', {type: 'audio', value: val})
        util.dispose(this.stream, () => {
          this.$emit('next', 'speakerCom')
        })
      },
      openDevice (devices) {
        let opt = {
          audio: devices === 'default' ? true : {deviceId: devices}
        }
        navigator.mediaDevices.getUserMedia(opt).then(stream => {
          this.stream = stream
          util.setVolume(stream, (res) => {
            if (this.$refs.volumeBar) {
              this.$refs.volumeBar.style.width = res + '%'
            }
          })
        }).catch((err) => {
          console.log(err.name)
          if (err.name === 'NotAllowedError') {
            this.tips = '未获取设备权限，请在设置中修改此应用权限。'
            console.log(this.tips)
          } else {
            this.tips = '请检测麦克风是否正常。'
          }
        })
      },
      close () {
        util.dispose(this.stream, () => {
          this.$emit('close')
        })
      }
    }
  }
</script>
<style scoped lang="scss">

    .microphone-box {
        margin: 48px 0 68px 0;

        p {
            padding: 15px 0;
        }
    }

    .microphone-bar {
        width: 300px;
        height: 20px;
        border-radius: 10px;
        margin: 0 auto;
        padding: 4px;
        background-color: #eaeaea;
        box-sizing: border-box;
    }

    .progress {
        content: " ";
        display: block;
        height: 9pt;
        border-radius: 6px;
        background-color: #8dc453
    }
</style>

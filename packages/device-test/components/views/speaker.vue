<template>
    <div>
        <Head title="检测播放设备" @close="close"/>
        <div class="pages-body">
            <MSelect type="speaker" @medioId="openDevice" :tips="tips" title="扬声器" @clean="cleanStream"/>
            <div class="headset-box audio-box">
                <p id="tips" style="display:none">请听音乐</p>
                <p id="loading-tips" style="display:none;">音频资源加载中...</p>
                <div id="visualizer_wrapper">
                    <canvas id="canvas" width="600" height="150"></canvas>
                </div>
            </div>

            <div id="next_area" v-if="is_show">
                <div class="tips red">
                    <p>能否听到清晰的音乐声音？</p>
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
  import Visualizer from '../script/headphones'
  import MSelect from './select'

  const speakerObj = new Visualizer()
  export default {
    props: {
      config: {
        type: Object
      }
    },
    components: {
      Head,
      MSelect
    },
    data () {
      return {
        tips: '如果听不见请切换扬声器。',
        is_show: false
      }
    },
    mounted () {
      setTimeout(() => {
        this.is_show = true
      }, 3000)
    },
    methods: {
      // 销毁之前的音频
      cleanStream () {
        speakerObj._audioEnd(() => {
          console.log('clean mp3 audio')
        })
      },
      // 下一步，并且提交测试报告
      onBtnNext (val) {
        this.$emit('setReport', {type: 'speaker', value: val})
        speakerObj._audioEnd(() => {
          this.$emit('next', 'reportCom')
        })
      },
      openDevice (devices) {
        let opt = {
          audio: devices === 'default' ? true : {deviceId: devices}
        }
        speakerObj.init(this.config)
        navigator.mediaDevices.getUserMedia(opt).then(() => {
          console.log('open speaker')
        }).catch((err) => {
          console.log(err.name)
          if (err.name === 'NotAllowedError') {
            this.tips = '未获取设备权限，请在设置中修改此应用权限。'
            console.log(this.tips)
          } else {
            this.tips = '请检测扬声器是否正常。'
          }
        })
      },
      close () {
        speakerObj._audioEnd(() => {
          this.$emit('close')
        })
      }
    }
  }
</script>
<style lang="scss">
    #visualizer_wrapper > #canvas {
        background-color: #042044;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #010f21;
        margin: 23px 0;
    }

</style>

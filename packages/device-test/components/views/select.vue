<template>
    <div>
        <div class="t-top">
            <div class="t-left">
                <img src="../assets/shexiangtou.png" alt="" v-if="type === 'video'">
                <img src="../assets/maikefeng.png" alt="" v-if="type === 'audio'">
                <img src="../assets/bofangqi.png" alt="" v-if="type === 'speaker'">
                选择{{title}}
            </div>
            <div class="se-box" @click="showOpt">
                <div class="se-label">{{sel_label}}</div>
                <div class="se-right">
                    <div :class="{'se-hover':is_show}"></div>
                </div>
                <div class="se-option" v-if="is_show">
                    <div class="se-option-item"
                         v-for="(item,index) in list"
                         :key="index"
                         @click="optClick(item)"
                         @mouseenter="addActive(item.deviceId)"
                         :class="{'opt-hover':item.is_active}">
                        {{item.label}}
                    </div>
                </div>
            </div>
            <button class="shua-xin" @click="btnRefresh">刷新设备</button>
        </div>
        <div class="tips red">
            <p>{{tips}}</p>
        </div>
    </div>
</template>
<script>
  export default {
    props: {
      type: {type: String},
      title: {type: String},
      tips: {type: String}
    },
    data () {
      return {
        list: [],
        is_show: false,
        sel_value: '',
        sel_label: '',
        video_list: [],
        audio_list: [],
        speaker_list: [],
      }
    },
    mounted () {
      this.getMediaList()
    },
    methods: {
      btnRefresh () {
        this.$emit('clean')
        this.getMediaList()
      },
      showOpt () {
        this.is_show = !this.is_show
      },
      optClick (val) {
        this.sel_value = val.deviceId
        this.sel_label = val.label
        this.$emit('clean')
        this.$emit('medioId', this.sel_value)
      },
      addActive (val) {
        this.list.forEach(v => {
          if (v.deviceId === val) {
            v.is_active = true
          } else {
            v.is_active = false
          }
        })
      },
      getMediaList () {
        let that = this
        navigator.mediaDevices.enumerateDevices().then(function (MediaDeviceInfo) {
          that.audio_list = []
          that.video_list = []
          that.speaker_list = []
          let p1 = 1
          let p2 = 1
          let p3 = 1
          for (let mediaDeviceInfo in MediaDeviceInfo) {
            let this_device = MediaDeviceInfo[mediaDeviceInfo]
            let temp = {}
            temp.deviceId = this_device.deviceId
            temp.groupId = this_device.groupId
            temp.label = this_device.label
            temp.is_active = false
            if (this_device.kind === 'audioinput') {
              if (temp.label === '') {
                temp.label = '麦克风' + p1
                p1++
              }
              that.audio_list.push(temp)
            }
            if (this_device.kind === 'videoinput') {
              if (temp.label === '') {
                temp.label = '摄像头' + p2
                p2++
              }
              if (temp.label.indexOf('前') >= 0 || temp.label.indexOf('正') >= 0) {
                that.video_list.splice(0, 0, temp)
              } else {
                that.video_list.push(temp)
              }
            }
            if (this_device.kind === 'audiooutput') {
              if (temp.label === '') {
                temp.label = '扬声器' + p3
                p3++
              }
              that.speaker_list.push(temp)
            }
          }
          switch (that.type) {
            case 'video':
              that.list = that.video_list
              break;
            case 'audio':
              that.list = that.audio_list
              break;
            case 'speaker':
              that.list = that.speaker_list
              break;
          }
        })
      },
    },
    watch: {
      is_show () {
        if (this.is_show) {
          this.addActive(this.sel_value)
          setTimeout(() => {
            document.onclick = () => {
              this.is_show = false
              document.onclick = null
            }
          }, 300)
        }
      },
      list (val) {
        if (val.length < 1) {
          this.tips = '没有发现设备，请检查USB接口是否正常'
        } else {
          this.sel_value = val[0].deviceId
          this.sel_label = val[0].label
          this.$emit('medioId', this.sel_value)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
    .t-top {
        width: 500px;
        height: 30px;
        position: relative;
        left: 20px;
        margin: 30px auto 0;

        .t-left {
            position: absolute;
            left: 0;
            top: 0;
            font-size: 14px;
            color: #454B63;
            letter-spacing: 0;
            text-align: center;
            display: flex;
            align-items: center;
            line-height: 30px;

            img {
                width: 25px;
                height: 25px;
                margin-right: 9px;
            }
        }
    }

    .se-box {
        width: 254px;
        height: 30px;
        box-sizing: border-box;
        background: #F7F7F7;
        border: 1px solid #159CF1;
        border-radius: 3px;
        position: absolute;
        cursor: pointer;
        top: 0;
        right: 134px;

        .se-label {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
            color: #454B63;
            line-height: 30px;
            text-align: left;
            padding: 0 20px 0 10px;

        }

        .se-right {
            width: 20px;
            height: 20px;
            position: absolute;
            right: 0;
            top: 4px;

            div {
                width: 0px;
                border: 6px solid #159CF1;
                border-left-color: transparent;
                border-bottom-color: transparent;
                border-right-color: transparent;
                position: absolute;
                left: 0;
                top: 8px;
                transition: all .3s;
            }

            .se-hover {
                transform: translateY(-8px) rotateZ(180deg);
                transform-origin: center center;
            }
        }

        .se-option {
            width: 100%;
            position: absolute;
            left: 0;
            top: 40px;
            background: #FFFFFF;
            z-index: 998;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.16);

            div {
                height: 36px;
                text-align: left;
                line-height: 36px;
                padding: 0 8px;
                cursor: pointer;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 14px;
                color: #454B63;
                letter-spacing: 0;
            }

            .opt-hover {
                background: #EBFDDE;
            }
        }
    }

    .shua-xin {
        width: 120px;
        height: 30px;
        background: #DBF0FD;
        border: 1px solid #159CF1;
        border-radius: 3px;
        font-size: 14px;
        color: #2980FF;
        letter-spacing: 0;
        text-align: center;
        outline: none;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;

        &:hover {
            background: #FFFFFF;
        }
    }
</style>

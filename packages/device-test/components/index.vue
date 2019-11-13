<template>
    <div class="test-dialog" v-if="dialogVisible">
        <div class="dialog-bodys">
            <component
                    v-bind:is="currentTabComponent"
                    @next="next"
                    @close="close()"
                    :report="report"
                    :config="config"
                    @setReport="setReport">

            </component>
        </div>
    </div>
</template>
<script>
  import videoCom from './views/video'
  import audioCom from './views/audio'
  import speakerCom from './views/speaker'
  import reportCom from './views/report'

  export default {
    name: 'deviceTest',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      config: {
        type: Object
      }
    },
    components: {
      videoCom,
      audioCom,
      speakerCom,
      reportCom
    },
    data () {
      return {
        dialogVisible: false,
        currentTabComponent: '',
        report: {
          audio: 0,
          video: '1',
          speaker: 0
        }
      }
    },
    created () {
      this.currentTabComponent = 'videoCom'
    },
    methods: {
      next (val) {
        this.currentTabComponent = val
      },
      setReport (val) {
        this.report[val.type] = val.value
      },
      close () {
        this.$emit('update:visible', false)
      }
    },
    watch: {
      visible (val) {
        if (val) this.currentTabComponent = 'videoCom'
        this.dialogVisible = val
      }
    }
  }
</script>
<style scoped lang="scss">
    @import "./style/index";

    .test-dialog {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 1003;
        background-color: rgba(0, 0, 0, .4);
        box-sizing: border-box;

        .dialog-bodys {
            width: 900px;
            height: 620px;
            background-color: #fff;
            border-radius: 3px;
            overflow: hidden;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            p {
                margin: 0;
            }
        }
    }
</style>

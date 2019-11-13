<template>
    <div>
        <Head title="测试报告" @close="close"/>
        <div class="pages-body">
            <table class="table report-table">
                <thead>
                <tr>
                    <th>摄像头</th>
                    <th>麦克风</th>
                    <th>声音</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <i class="icon" :class="[report.video === '1' ? 'icon-success': 'icon-fail']">
                            {{report.video === '1'?'正常':'异常'}}
                        </i>
                    </td>
                    <td>
                        <i class="icon" :class="[report.audio === '1'? 'icon-success': 'icon-fail']">
                            {{report.audio === '1'?'正常':'异常'}}
                        </i>
                    </td>
                    <td>
                        <i class="icon" :class="[report.speaker === '1'? 'icon-success': 'icon-fail']">
                            {{report.speaker === '1'?'正常':'异常'}}
                        </i>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="btn-area">
                <div class="report-btn">
                    <a class="btn btn-fail" href="javascript:;" @click="retry">重新检测</a>
                    <p style="margin: 15px 0">
                        <a class="btn-history" id="viewReport" href="javascript:;"
                           @click="close">关闭窗口</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import Head from './head'

  export default {
    props: {
      report: {
        type: Object,
        default: {
          audio: 0,
          video: 0,
          speaker: 0
        }
      }
    },
    components: {
      Head
    },
    methods: {
      retry () {
        this.$emit('next', 'videoCom')
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang="scss">
    table {
        border-collapse: collapse;
        border-spacing: 0
    }

    td, th {
        padding: 0
    }

    .table {
        width: 100%;
        border-collapse: collapse
    }

    .table > thead > tr > th {
        background: #DBF0FD;
        border: 1px solid #159CF1;
        height: 30px;
        font-size: 14px;
        color: #2980FF;
    }

    .table > tbody > tr > td {
        height: 75px;
        background: #FFFFFF;
        border: 1px solid #159CF1;
        border-radius: 3px;
        font-size: 14px;
        color: #454B63;
    }

    .table th {
        font-weight: 700;
        background-color: #d8d8d8
    }

    .table td {
        color: #999
    }

    .report-table {
        margin: 50px 0;
    }

    .icon {
        font-style: normal
    }

    .icon:before {
        content: "";
        display: inline-block;
        clear: both;
        width: 26px;
        height: 26px;
        background: transparent none no-repeat center center;
        background-size: 22px;
        vertical-align: middle;
    }

    .icon.icon-success {
        color: #454B63;
        line-height: 26px;
    }

    .icon.icon-success:before {
        background-image: url(../assets/zhengchang.png);
        margin-right: 13px;
    }

    .icon.icon-fail {
        color: #f44e51;
        line-height: 26px;
    }

    .icon.icon-fail:before {
        background-image: url(../assets/yichang.png);
        margin-right: 13px;
    }

    .btn-history {
        display: inline-block;
        font-size: 14px;
        color: #159CF1;
        text-decoration: underline
    }

    .btn-history:hover {
        color: #f44e51
    }
</style>

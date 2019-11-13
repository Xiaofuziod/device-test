import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    videoList: [],
    audioList: [],
    speakerList: [],
    report: {
      video: 0,
      audio: 0,
      speaker: 0
    }
  },
  mutations: {
    SET_VIDEO_DATA (state, data) {
      state.videoList = data
    },
    SET_AUDIO_DATA (state, data) {
      state.audioList = data
    },
    SET_SPEAKER_DATA (state, data) {
      state.speakerList = data
    },
    SET_TEST_REPORT (state, data) {
      state.report[data.type] = data.value
    }
  },
  actions: {
    // 获取设备列表
    getMediaList ({commit}) {
      navigator.mediaDevices.enumerateDevices().then(function (MediaDeviceInfo) {
        console.log(MediaDeviceInfo)
        let _devices = {
          audio: [],
          video: [],
          speaker: []
        }
        let p1 = 1
        let p2 = 1
        let p3 = 1
        for (let mediaDeviceInfo in MediaDeviceInfo) {
          let thisdevice = MediaDeviceInfo[mediaDeviceInfo]
          let temp = {}
          temp.deviceId = thisdevice.deviceId
          temp.groupId = thisdevice.groupId
          temp.label = thisdevice.label
          if (thisdevice.kind === 'audioinput') {
            if (temp.label === '') {
              temp.label = '麦克风' + p1
              p1++
            } else {
              _devices.audio.push(temp)
            }
          }
          if (thisdevice.kind === 'videoinput') {
            if (temp.label === '') {
              temp.label = '摄像头' + p2
              p2++
            }
            if (temp.label.indexOf('前') >= 0 || temp.label.indexOf('正') >= 0) {
              _devices.video.splice(0, 0, temp)
            } else {
              _devices.video.push(temp)
            }
          }
          if (thisdevice.kind === 'audiooutput') {
            if (temp.label === '') {
              temp.label = '扬声器' + p3
              p3++
            } else {
              _devices.speaker.push(temp)
            }
          }
        }
        commit('SET_VIDEO_DATA', _devices.video)
        commit('SET_AUDIO_DATA', _devices.audio)
        commit('SET_SPEAKER_DATA', _devices.speaker)
      })
    },
    // 提交测试报告
    submitReoprt ({commit}, data) {
      commit('SET_TEST_REPORT', data)
    }
  }
})

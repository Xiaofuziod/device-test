let fs = require('fs')
let audioContexts = null
let allCapsReachBottom = false

var Visualizer = function () {
  this.audioContext = null
  this.source = null // the audio source
  this.animationId = null
  this.status = 0 // flag for sound is playing 1 or stopped 0 end 2
  this.forceStop = false
  this.audiobuffer = null
}
Visualizer.prototype = {
  init: function (audioCif) {
    this._prepareAPI()
    this._getAudioData(audioCif).then(res => {
      this._addEventListner(res)
    })
  },
  _prepareAPI: function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame
    try {
      this.audioContext = new AudioContext()
      audioContexts = this.audioContext
    } catch (e) {
      console.log(e)
    }
  },
  _getAudioData: function (audioCif) {
    return new Promise((resolve) => {
      if (audioCif.type === 'location') {
        let data = fs.readFileSync(audioCif.path)
        let ab = new ArrayBuffer(data.length)
        let view = new Uint8Array(ab)
        for (let i = 0; i < data.length; ++i) {
          view[i] = data[i]
        }
        resolve(ab)
      } else {
        let xhr = new XMLHttpRequest()
        xhr.responseType = 'arraybuffer'
        xhr.open('GET', audioCif.path)
        xhr.send(null)
        xhr.onload = (res) => {
          resolve(res.target.response)
        }
      }
    })
  },
  _addEventListner: function (data) {
    let that = this
    that.audioContext.decodeAudioData(data, function (buffer) {
      that.audiobuffer = buffer
      that._visualize(that.audioContext, buffer)
    }, function (e) {
      console.error(e)
    })
  },

  _visualize: function (audioContext, buffer) {
    var audioBufferSouceNode = audioContext.createBufferSource(),

      that = this
    this.analyser = audioContext.createAnalyser()
    audioBufferSouceNode.connect(this.analyser)
    this.analyser.connect(audioContext.destination)
    audioBufferSouceNode.buffer = buffer
    audioBufferSouceNode.loop = true
    if (!audioBufferSouceNode.start) {
      audioBufferSouceNode.start = audioBufferSouceNode.noteOn // in old browsers use noteOn method
      audioBufferSouceNode.stop = audioBufferSouceNode.noteOff // in old browsers use noteOff method
    }

    // stop the previous sound if any
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
    }
    if (this.source !== null) {
      this.source.stop(0)
    }
    audioBufferSouceNode.start(0)
    this.status = 1
    this.source = audioBufferSouceNode
    audioBufferSouceNode.onended = function () {
      that._audioEnd(that)
    }
    this._drawSpectrum(this.analyser)
  },
  _drawSpectrum: function (analyser) {
    var that = this,
      canvas = document.getElementById('canvas'),
      cwidth = canvas.width,
      cheight = canvas.height - 2,
      meterWidth = 10, // width of the meters in the spectrum
      gap = 2, // gap between meters
      capHeight = 2,
      capStyle = '#fff',
      meterNum = cwidth / (10 + 2), // count of the meters
      capYPositionArray = [], /// /store the vertical position of hte caps for the preivous frame
      ctx = canvas.getContext('2d'),
      gradient = ctx.createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(1, '#0f0')
    gradient.addColorStop(0.5, '#ff0')
    gradient.addColorStop(0, '#f00')
    var drawMeter = function () {
      var array = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(array)
      if (that.status === 0) {
        // fix when some sounds end the value still not back to zero
        for (var i = array.length - 1; i >= 0; i--) {
          array[i] = 0
        }
        allCapsReachBottom = true
        for (var i = capYPositionArray.length - 1; i >= 0; i--) {
          allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0)
        }
        if (allCapsReachBottom) {
          cancelAnimationFrame(that.animationId) // since the sound is stoped and animation finished, stop the requestAnimation to prevent potential memory leak,THIS IS VERY IMPORTANT!
          return
        }
      }

      var step = Math.round(array.length * 0.75 / meterNum) // sample limited data from the total array
      ctx.clearRect(0, 0, cwidth, cheight)
      for (var i = 0; i < meterNum; i++) {
        var value = array[i * step]
        value -= 30
        if (value > cheight) value = cheight
        if (value <= 0) value = 0
        if (capYPositionArray.length < Math.round(meterNum)) {
          capYPositionArray.push(value)
        }
        ctx.fillStyle = capStyle
        if (value < capYPositionArray[i]) {
          ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight)
        } else {
          ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight)
          capYPositionArray[i] = value
        }
        ctx.fillStyle = gradient

        ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight) // the meter
      }
      that.animationId = requestAnimationFrame(drawMeter)
    }
    this.animationId = requestAnimationFrame(drawMeter)
  },
  _audioEnd: function (cb) {
    if (this.forceStop) {
      this.forceStop = false
      this.status = 1
      return
    }
    this.status = 0
    if (audioContexts) {
      audioContexts.close().then(cb)
    } else {
      cb()
    }

  }
}
export default Visualizer

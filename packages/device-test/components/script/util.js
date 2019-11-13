let audioContext

/**
 * 初始化 AudioContext 返回 mediaStreamSource && scriptProcessor
 * @param stream
 * @returns {Promise}
 */
export function initAudioContext (stream) {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext
    audioContext = new AudioContext()
  } catch (e) {
    console.warn('Web Audio API not supported.')
  }
  return new Promise(function (callback) {
    var mediaStreamSource, scriptProcessor
    mediaStreamSource = audioContext.createMediaStreamSource(stream)
    scriptProcessor = audioContext.createScriptProcessor(0, 1, 1)
    mediaStreamSource.connect(scriptProcessor)
    scriptProcessor.connect(audioContext.destination)

    if (!!callback && typeof callback === 'function' && !!mediaStreamSource && !!scriptProcessor) {
      callback({
        mediaStreamSource: mediaStreamSource,
        scriptProcessor: scriptProcessor,
        audioContext: audioContext
      })
    }
  })
}

/**
 * 监听声音scriptProcessor
 * @param scriptProcessor
 * @param onprocess
 */
export function onAudioProcess (scriptProcessor, onprocess) {
  if (scriptProcessor) {
    scriptProcessor.onaudioprocess = function (audioProcessingEvent) {
      var inputBuffer = audioProcessingEvent.inputBuffer
      var outputBuffer = audioProcessingEvent.outputBuffer

      for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        var inputData = inputBuffer.getChannelData(channel)
        var outputData = outputBuffer.getChannelData(channel)

        for (var sample = 0; sample < inputBuffer.length; sample++) {
          outputData[sample] = inputData[sample]
        }
      }
      if (onprocess) {
        var input = audioProcessingEvent.inputBuffer.getChannelData(0)
        var len = input.length
        var sum = 0.0
        for (var i = 0; i < len; ++i) {
          sum += input[i] * input[i]
        }
        var volumeValue = Math.sqrt(sum / len)
        volumeValue = (Math.sin(volumeValue * 3.1415 / 2)) * 100 >> 0

        onprocess(volumeValue)
      }
    }
  }
}

/**
 * 声音显示
 * @param stream
 * @param dom
 * @returns {Promise}
 */
export function setVolume (stream, onprocess) {
  return new Promise(function (callback) {
    initAudioContext(stream).then(function () {
      var mediaStreamSource = arguments[0].mediaStreamSource,
        scriptProcessor = arguments[0].scriptProcessor,
        audiocontext = arguments[0].audioContext
      onAudioProcess(scriptProcessor, onprocess)
      callback({
        mediaStreamSource: mediaStreamSource,
        scriptProcessor: scriptProcessor,
        audiocontext: audiocontext

      })
    }).catch(err => {
      console.log(err)
    })
  })
};

// 销毁音频对象

export function dispose (stream, cb) {
  if (audioContext) {
    audioContext.close().then(cb)
  } else {
    cb()
  }

};

export function disposeVideo (stream, cb) {
  if (stream) {
    let trackList = stream.getTracks()
    for (let index in trackList) {
      trackList[index].stop()
    }
    stream = null
  }
  cb && cb()
}

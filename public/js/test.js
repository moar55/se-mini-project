var client = io('localhost:3000');

var errorCallback = function(e) {
  console.log('Reeeejected!', e);
};

navigator.getUserMedia  = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;


if (navigator.getUserMedia) {
  navigator.getUserMedia({audio: true}, function(strweam) {
    initializeRecorder(stream);
    }, errorCallback);
  }
else {
  alert("error");

function initializeRecorder(stream) {
  var audioContext = window.AudioContext;
  var context = new audioContext();
  var audioInput = context.createMediaStreamSource(stream);
  var bufferSize = 2048;
  // create a javascript node
  var recorder = context.createScriptProcessor(bufferSize, 1, 1);
  // specify the processing function
  recorder.onaudioprocess = recorderProcess;
  // connect stream to our recorder
  audioInput.connect(recorder);
  // connect our recorder to the previous destination
  recorder.connect(context.destination);
}

function convertFloat32ToInt16(buffer) {
  l = buffer.length;
  buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l])*0x7FFF;
  }
  return buf.buffer;
}

function recorderProcess(e) {
  var left = e.inputBuffer.getChannelData(0);
  var right = e.inputBuffer.getChannelData(1);
  client.emit('left-data',convertFloat32ToInt16(left));
  client.emit('right-data',convertFloat32ToInt16(right));

}

var recording = false;

var startButton = document.getElementById('start');
var recorder = null;

var formatOptions = {mimeType: "audio/webm"};
var recordedChunks = [];

startButton.onclick = function() {
  console.log('button clicked');

  if (recorder && recorder.state === "recording") {
    recorder.stop();
  }
  else {
    // Set up audio recording
    chrome.tabCapture.capture({audio: true}, function(stream) {
      recorder = new MediaRecorder(stream, formatOptions);
      recorder.ondataavailable = handleDataAvailable;

      // Continue playing the stream to the user
      window.audio = document.createElement('audio');
      window.audio.srcObject = stream;
      window.audio.play();

      recorder.start();
    });
  }
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    //recordedChunks.push(event.data);
    //downloadChunks();

    var url = URL.createObjectURL(event.data);
    var preview = document.createElement('audio');
    preview.controls = true;
    preview.src = url;
    document.body.appendChild(preview);
  }
}

function downloadChunks() {
  // From https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API

  var blob = new Blob(recordedChunks, {
    type: "video/webm"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}
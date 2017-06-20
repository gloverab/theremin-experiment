mousedown = false
minFrequency = 20
maxFrequency = 2000
minGain = 0
maxGain = 1

var audioContext = new AudioContext()
// reverbjs.extend(audioContext)

oscillator1 = null
oscillator2 = null

var gainNode1 = audioContext.createGain()
var gainNode2 = audioContext.createGain()

// Verb stuff! Isn't hooked up to anything right now.

// var reverbUrl = "./impulse-responses/wet_singing.mp3"
// var reverbNode = audioContext.createReverbFromUrl(reverbUrl, function() {
//   reverbNode.connect(audioContext.destination);
// })

// var sourceUrl = "./impulse-responses/dry_singing.mp3";
// var sourceNode = audioContext.createSourceFromUrl(sourceUrl, function() {
//   sourceNode.connect(reverbNode);
// })

// Calculations

var calculateFrequency = function(mouseX) {
  return ((mouseX / window.innerWidth) * maxFrequency) + minFrequency
}

var calculateFrequency2 = function(mouseX) {
  var sliderValue = document.getElementById('oscillator-2-detune').value
  return (((mouseX / window.innerWidth) * maxFrequency) + minFrequency) * (sliderValue * .015625)
}

var calculateGain = function(mouseY) {
  var minGain = 0, maxGain = 1
  return 1 - ((mouseY / window.innerHeight) * maxGain) + minGain
}

var calculateGain2 = function(mouseY) {
  var sliderValue = document.getElementById('oscillator-2-gain').value
  return (1 - ((mouseY / window.innerHeight) * maxGain) + minGain) / (129 - sliderValue)
}

// Mousedown events
document.body.addEventListener('mousedown', function (event) {
  mousedown = true

  // Creating oscillators
  oscillator1 = audioContext.createOscillator()
  oscillator2 = audioContext.createOscillator()

  setOscillator1(event)
  setOscillator2(event)
  
  // Connecting oscillators to gain
  oscillator1.connect(gainNode1)
  oscillator2.connect(gainNode2)
  gainNode1.connect(audioContext.destination)
  gainNode2.connect(audioContext.destination)

  // Staring oscillators
  oscillator1.start(audioContext.currentTime)
  oscillator2.start(audioContext.currentTime)
})

// Mouseup events
document.body.addEventListener('mouseup', function () {
  mousedown = false

  // Stopping everything, provided that there is something happening.
  if (oscillator1) {
    oscillator1.stop(audioContext.currentTime)
    oscillator2.stop(audioContext.currentTime)

    oscillator1.disconnect()
    oscillator2.disconnect()
  }
})

document.body.addEventListener('mousemove', function(event) {
  if (mousedown) {
    setOscillator1(event)
    setOscillator2(event)
  }
})

// document.body.addEventListener('keydown', function(event) {
  
//   switch(event.key.toLocaleLowerCase()) {
//     case "a":
//     oscillator1.frequency.setTargetAtTime(calculateFrequency(200), audioContext.currentTime, 0.01)
//   }

// })

document.getElementById('oscillator-2-detune').addEventListener('change', function(event) {
  event.currentTarget.value
})

// Set Oscillator Methods

function setOscillator1(event) {
  oscillator1.frequency.setTargetAtTime(calculateFrequency(event.clientX), audioContext.currentTime, 0.01)
  gainNode1.gain.setTargetAtTime(calculateGain(event.clientY), audioContext.currentTime, 0.01)
}

function setOscillator2(event) {
  oscillator2.frequency.setTargetAtTime((calculateFrequency2(event.clientX)), audioContext.currentTime, 0.01)
  gainNode2.gain.setTargetAtTime((calculateGain2(event.clientY)), audioContext.currentTime, 0.01)
}
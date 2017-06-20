mousedown = false
minFrequency = 20
maxFrequency = 2000
minGain = 0
maxGain = 1

var context1 = new AudioContext()
var context2 = new AudioContext()
reverbjs.extend(context1)

oscillator1 = null
oscillator2 = null

var gainNode1 = context1.createGain()
var gainNode2 = context2.createGain()

// Verb stuff! May not work...

var reverbUrl = "./impulse-responses/wet_singing.mp3"
var reverbNode = context1.createReverbFromUrl(reverbUrl, function() {
  reverbNode.connect(context1.destination);
})

var sourceUrl = "./impulse-responses/dry_singing.mp3";
var sourceNode = context1.createSourceFromUrl(sourceUrl, function() {
  sourceNode.connect(reverbNode);
})

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
  oscillator1 = context1.createOscillator()
  oscillator2 = context2.createOscillator()

  setOscillator1(event)
  setOscillator2(event)
  
  // Connecting oscillators to gain
  oscillator1.connect(gainNode1)
  oscillator2.connect(gainNode2)
  gainNode1.connect(context1.destination)
  gainNode2.connect(context2.destination)

  // Staring oscillators
  oscillator1.start(context1.currentTime)
  oscillator2.start(context2.currentTime)
})

// Mouseup events
document.body.addEventListener('mouseup', function () {
  mousedown = false

  // Stopping everything, provided that there is something happening.
  if (oscillator1) {
    oscillator1.stop(context1.currentTime)
    oscillator2.stop(context2.currentTime)

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
//     oscillator1.frequency.setTargetAtTime(calculateFrequency(200), context1.currentTime, 0.01)
//   }

// })

document.getElementById('oscillator-2-detune').addEventListener('change', function(event) {
  event.currentTarget.value
})

// Set Oscillator Methods

function setOscillator1(event) {
  oscillator1.frequency.setTargetAtTime(calculateFrequency(event.clientX), context1.currentTime, 0.01)
  gainNode1.gain.setTargetAtTime(calculateGain(event.clientY), context1.currentTime, 0.01)
}

function setOscillator2(event) {
  oscillator2.frequency.setTargetAtTime((calculateFrequency2(event.clientX)), context2.currentTime, 0.01)
  gainNode2.gain.setTargetAtTime((calculateGain2(event.clientY)), context2.currentTime, 0.01)
}
// onkeypress event for keyboard
document.onkeypress = function (e) {
  var e = e || window.event;
  let letter = String.fromCharCode(e.keyCode);
  var pressedKey = document.getElementById(letter);
  // change key colors
  if (!pressedKey.style.opacity) {
    pressedKey.style.opacity = 0.72;
  } else if (pressedKey.style.opacity < 0.9) {
    pressedKey.style.opacity = parseFloat(pressedKey.style.opacity) + 0.07;
  } else if (!pressedKey.classList.contains('hot')) {
    pressedKey.classList.add('hot', 'hot1')
  } else {
    currentClass = pressedKey.className.match(/hot(\d+)/)[0];
    toneNum = currentClass.match(/\d+/);
    if (toneNum < 10) {
      newClass = 'hot'+ (+toneNum + 1)
      pressedKey.classList.remove(currentClass);
      pressedKey.classList.add(newClass) 
    }
  }
  Synth.playNote(letter);
};

// onclick event for oscillator switches
var sliders = document.getElementsByClassName('slider');
[].forEach.call(sliders, function(sliders) {
  sliders.onclick = function(event) {
    Synth.changeOscillator(event.target.id);
  }
})

// Synthesiser
var Synth = (function() {
  var myAudioContext;
  var oscillator;
  var gainNode;
  var oscillatorType = 'sine';

  // Constructor
  var Synth = function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    synthAudioContext = new window.AudioContext();
  };
  
  // Change oscillator type
  Synth.changeOscillator = function (waveform) {
    oscillatorType = waveform;
  }
  
  // Play a note.
  Synth.playNote = function(letter) {
    oscillator = synthAudioContext.createOscillator();
    gainNode = synthAudioContext.createGain();
    oscillator.type = oscillatorType;
    gainNode.connect(synthAudioContext.destination);
    oscillator.connect(gainNode);
    var note = {
      z: 110.00, //A2
      x: 123.47, //B2
      c: 130.81, //C3
      v: 146.83, //D3
      b: 164.81, //E3
      n: 174.61, //F3
      m: 196.00, //G3
      a: 220.00, //A3
      s: 246.94, //B3
      d: 261.63, //C4
      f: 293.66, //D4
      g: 329.63, //E4
      h: 349.23, //F4
      j: 392.00, //G4
      k: 440.00, //A4
      l: 493.88, //B4
      q: 523.25, //C5
      w: 587.33, //D5
      e: 659.25, //E5
      r: 698.46, //F5
      t: 783.99, //G5
      y: 880.00, //A5
      u: 987.77, //B5
      i: 1046.50, //C6
      o: 1174.66, //D6
      p: 1318.51, //E6
    }
    oscillator.frequency.value = note[letter];
    gainNode.gain.setValueAtTime(noteVolume(note[letter]), synthAudioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, synthAudioContext.currentTime + 2);
  
    oscillator.start(0);
  };

  var noteVolume = function(freq) {
    var baseVolumeByWaveform = {
      sine: 0.3,
      triangle: 0.25,
      square: 0.05,
      sawtooth: 0.08
    };
    var baseVolume = baseVolumeByWaveform[oscillatorType];
    var volume = ((baseVolume + ((900 - freq)/10000)));
    if (volume < baseVolume) { volume = baseVolume }
    return volume
  }

  // Export Synth.
  return Synth;
})();


// Initialize the page.
window.onload = function() {
  var synth = new Synth();
}

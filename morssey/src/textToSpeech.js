


export function tts(speechText) {
  var speech = new SpeechSynthesisUtterance();
  speech.lang = "en";
  speech.text = speechText;

  //console.log(speechText);
  window.speechSynthesis.speak(speech);


}




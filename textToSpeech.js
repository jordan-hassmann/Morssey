var speech = new SpeechSynthesisUtterance();
speech.lang = "en";

document.querySelector("#start").addEventListener("click", () => {
  speech.text = document.querySelector("textarea").value;
  window.speechSynthesis.speak(speech);
});


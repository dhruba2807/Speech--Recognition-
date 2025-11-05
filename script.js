const recordBtn = document.querySelector(".record");
const result = document.querySelector(".result");
const downloadBtn = document.querySelector(".download");
const inputLanguage = document.querySelector("#language");
const clearBtn = document.querySelector(".clear");
const wordCountText = document.querySelector("#wordCount");


let SpeechRecognition = window.webkitSpeechRecognition;
let recognition;
let recording = false;

// populate language dropdown
function populateLanguages(){
  languages.forEach(lang=>{
    const option = document.createElement("option");
    option.value = lang.code;
    option.textContent = lang.name;
    inputLanguage.appendChild(option);
  })
}
populateLanguages();

// update word counter
function updateWordCount(){
  let text = result.innerText.trim();
  if(text === ""){
    wordCountText.innerText = "Words : 0";
    return;
  }
  let count = text.split(/\s+/).length;
  wordCountText.innerText = "Words : " + count;
}

// start speech recognition
function speechToText(){
  try{
    recognition = new SpeechRecognition();
    recognition.lang = inputLanguage.value;
    recognition.interimResults = true;

    recordBtn.classList.add("recording");
    recordBtn.querySelector("p").innerText = "Listening...";
    recognition.start();

    recognition.onresult = (event)=>{
      const speechText = event.results[0][0].transcript;

      // voice command clear text
      if(speechText.toLowerCase().includes("clear text")){
        result.innerHTML = "";
        updateWordCount();
        return;
      }

      if(event.results[0].isFinal){
        result.innerHTML += " " + speechText;
        let interimNode = document.querySelector(".interim");
        if(interimNode) interimNode.remove();
      } else {
        if(!document.querySelector(".interim")){
          const p = document.createElement("p");
          p.classList.add("interim");
          result.appendChild(p);
        }
        document.querySelector(".interim").innerText = speechText;
      }

      updateWordCount();
      downloadBtn.disabled = false;
    }

    recognition.onerror = ()=>{
      stopRecording();
    }

  }catch(e){
    console.log(e);
  }
}

recordBtn.addEventListener("click",()=>{
  if(!recording){
    speechToText();
    recording = true;
  }else{
    stopRecording();
  }
});

function stopRecording(){
  recognition.stop();
  recordBtn.querySelector("p").innerText = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

// download text file
function download(){
  const text = result.innerText;
  const a = document.createElement("a");
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
  a.download = "speech.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

downloadBtn.addEventListener("click", download);

clearBtn.addEventListener("click",()=>{
  result.innerHTML = "";
  updateWordCount();
  downloadBtn.disabled = true;
});


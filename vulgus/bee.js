
let chosenPhase = '1'
let chosenWord
let tr = 0
    const B1 = document.getElementById("P1")
    const B2 = document.getElementById("P2")
    const B3 = document.getElementById("P3")
    const SR = document.getElementById("SR")
    SR.addEventListener('click', ()=>{phaseChoose('4')})

checkRound()
function speak(text){
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Optional: Pick a specific voice
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices[0]; // Usually the system default
  
  window.speechSynthesis.speak(utterance);
}
let round = 0

async function checkRound() {
   const response = await fetch('/roundNum')
   round = response.num
   if(round > 0){
     const SR = document.getElementById("SR")
        SR.style.display = "block"
   }
}
function phaseChoose(phase){
switch (phase) {
    case '1':{ 
        chosenPhase = '1'
        B1.style.backgroundColor = "black"
        B2.style.backgroundColor = "green"
        B3.style.backgroundColor = "green"
        SR.style.backgroundColor = "green"
        getword()
       }
        break;
        case '2':
      {  chosenPhase = '2'
        B2.style.backgroundColor = "black"
        B1.style.backgroundColor = "green"
        B3.style.backgroundColor = "green"
        SR.style.backgroundColor = "green"
        getword()
        }
        break
        case '3':
    {    chosenPhase = '3'
        B3.style.backgroundColor = "black"
        B2.style.backgroundColor = "green"
        B1.style.backgroundColor = "green"
        SR.style.backgroundColor = "green"
        getword()
        }
        break
                case '4':
    {    chosenPhase = 'SR'
        B3.style.backgroundColor = "green"
        B2.style.backgroundColor = "green"
        B1.style.backgroundColor = "green"
        SR.style.backgroundColor = "black"
        getoldword()
        }
    }

    
    getDoneWords()
    console.log(chosenPhase)
    }

async function getword() {
    try{
        const response = await fetch(`/hive${chosenPhase}`)
        console.log("fetchin")

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
        }
        console.log("the word")

        chosenWord = await response.text()
        console.log(chosenWord)
        }

    catch(err){
        console.log(err)
    }
    tr = 0
    }
 
async function getResult(event) {
      let struggle
    const phase = chosenPhase
    const tried = chosenWord


    event.preventDefault
  const attempt = document.getElementById("try").value


  if(attempt === chosenWord.trim()){
    struggle = false
    alert('Correct!')
  }
  else{
    struggle = true
     alert('incorrect! correct spelling:' + chosenWord)
  }
  
  try{
  const response = await fetch("/left", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({phase, tried, struggle}),
})
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
  
    console.log("the word")
    
}
    catch(err){
    console.log(err)
    }
    getword()
    getDoneWords()
    }
 async function getDoneWords() {
    try{
        const response = await fetch(`/getWords`)
        console.log("fetchin")

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
        }
        console.log("the word")

        const saved = await response.json()
        const incorrectWords = document.getElementById("IW")
        incorrectWords.textContent = saved.INwords
        const correctWords = document.getElementById("CW")
        correctWords.textContent = saved.donewords
        const bar = document.getElementById("progress")
        const num = (saved.done-2) * 0.025
        console.log(saved.left)
        const wordsD = saved.left
        console.log(num)
        console.log(wordsD)
        bar.style.width =  `${num}%`

        if(wordsD === 3){
        try{
        const response = await fetch('/only-str')
        alert("Congrats, you've practiced all the words! " + response.text())
        window.location = '/statistics'
        }
        catch(err){
        console.error(err)
        }
        }
        }

    catch(err){
        console.log(err)
    }
    
    }

    phaseChoose("1")

    const submit = document.getElementById('submit')
    submit.addEventListener('click', getResult)

    B1.addEventListener('click', ()=>{
        phaseChoose('1')
    })
    B2.addEventListener('click', ()=>{
        phaseChoose('2')
    })
    B3.addEventListener('click', ()=>{
        phaseChoose('3')
    })
    document.getElementById("R").addEventListener('click', reset)

    const sound = document.getElementById("sound")
    sound.addEventListener('click', function(){
        puter.ai.txt2speech(chosenWord)
    .then((audio) => {
        audio.play();
    });

    })

async function getInfo(mode) {
    try{
    const res = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${chosenWord.trim()}`)
    const info = await res.json()
    if (!res.ok) {
    throw new Error(`Response status: ${res.status}`)
        }
       console.log(info)

const definition = info.entries[0].senses[0].definition
console.log(definition)
let example = info.entries[0].senses[0].examples

if(example){
    example = example[0] 
}
if(!example){
    example = 'There is no sentence yet.'
}

if(example === " "){
    example = info.entries[0].senses[0].quotes
    
}

const POS = info.entries[0].partOfSpeech

if(mode === 'def')
{document.getElementById("Definition").textContent = definition

}
if(mode === 'ex')
{
  puter.ai.txt2speech(example)
    .then((audio) => {
        audio.play();
    });

}

if(mode === 'POS')
{document.getElementById("POS").textContent = POS

}
console.log(chosenWord, definition, example, POS)
if (tr = 0){
const response = await fetch("/writer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({chosenWord, definition, example, POS}),
})
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }}
}
    catch(err){
        console.log(err)
    }
    tr = 1
    }



  
async function getoldword() {
    try{
        
        const response = await fetch(`/spaced-repetition`)
        console.log("fetchin")

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
        }
        console.log("the word")

        chosenWord = await response.text()
        console.log(chosenWord)
        }

    catch(err){
        console.log(err)
    }
    }



     async function reset(event) {
        event.preventDefault()
     const input = prompt("Are you sure you want to reset your words? Keep in mind this will delete the list of the words you got wrong, and the list of the words you got right.", "Type YES if you're sure you want to reset")
     if (input === "YES"){
        try
        {
        const response = await fetch(`/reset`)
        console.log("fetchin")
        

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
        }}

        catch(err){
            console.log(err)
        }
        location.reload()
     }
    else{
        alert("reset aborted")
        }
     }
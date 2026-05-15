
let chosenPhase = '1'
let chosenWord
let tr = 0

    const B1 = document.getElementById("P1")
    const B2 = document.getElementById("P2")
    const B3 = document.getElementById("P3")
    
function wordChoose(phase){
switch (phase) {
    case '1':{ 
        chosenPhase = '1'
        B1.style.backgroundColor = "black"
        B2.style.backgroundColor = "green"
        B3.style.backgroundColor = "green"
       }
        break;
        case '2':
      {  chosenPhase = '2'
        B2.style.backgroundColor = "black"
        B1.style.backgroundColor = "green"
        B3.style.backgroundColor = "green"
        }
        break
        case '3':
    {    chosenPhase = '3'
        B3.style.backgroundColor = "black"
        B2.style.backgroundColor = "green"
        B1.style.backgroundColor = "green"
        }
        break
        default: console.log("Yeah no matches buddy, try again")
   }
    getword()
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


  if(attempt === chosenWord){
    struggle = false
    alert('Correct!')
  }
  else{
    struggle = true
     alert('incorrect!')
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
        const num = saved.left * 0.025
        console.log(saved.left)
        console.log(num)
        bar.style.width =  `${num}%`

        if(saved.left >= 1){
            alert("Congrats, you're done!")
            const SR = document.getElementById("SR")
            SR.style.display = "block"
            const difficult = document.getElementById("OD")
            difficult.style.display = "block"
        }
        }

    catch(err){
        console.log(err)
    }
    }
 
    
    wordChoose("1")



    const submit = document.getElementById('submit')
    submit.addEventListener('click', getResult)

    B1.addEventListener('click', wordChoose1)
    B2.addEventListener('click', wordChoose2)
    B3.addEventListener('click', wordChoose3)

        function wordChoose1(){
        wordChoose('1')
    }
        function wordChoose2(){
        wordChoose('2')
    }
        function wordChoose3(){
        wordChoose('3')
    }

    const sound = document.getElementById("sound")
    sound.addEventListener('click', function(){
        puter.ai.txt2speech(chosenWord)
    .then((audio) => {
        audio.play();
    });
    })

    async function getInfo(mode) {
    try{
    const res = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${chosenWord}`)
    const info = await res.json()
    if (!res.ok) {
    throw new Error(`Response status: ${res.status}`)
        }
       console.log(info)
       let tr = 0
const definition = info.entries[0].senses[0].definition
console.log(definition)
let example = info.entries[0].senses[0].examples


if(example === " "){
    example = info.entries[0].senses[0].quotes
    
}
if(!example[0]){
    example = 'There is no definition yet.'
}
if(!(example === " ")){
    example = example[0] 
}

const POS = info.entries[0].partOfSpeech
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
    
    }
if(mode === 'def')
{document.getElementById("Definition").textContent = definition
    tr = 1
}
if(mode === 'ex')
{
   
    console.log(example +"this")
    tr = 1
    puter.ai.txt2speech(example)
    .then((audio) => {
        audio.play();
    });
    tr= 1
    }


if(mode === 'POS')
{document.getElementById("POS").textContent = POS
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
    
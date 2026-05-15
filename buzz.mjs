import express from 'express'
const app = express()
import {promises as fs} from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fsi from 'fs';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname +'/vulgus')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res)=>{
    res.sendFile(path.join(__dirname, "/vulgus/interface.html"))
}
)
app.get('/hive1', async (req, res)=>{
try
{
console.log("try harder")
const wordList = await fs.readFile('Phase1.csv', 'utf-8')
const dictionary = await fs.readFile('Dict1.csv', 'utf-8')
const lengthA = wordList.split(",").length

let chosenWord
console.log("trying")
    const wordArray = wordList.split(",")
    chosenWord = wordArray[Math.floor(Math.random() * wordArray.length)]
    const words = wordList.replace(","+chosenWord, "")
    const done = words.length
    fs.writeFile('Phase1.csv', words)
    console.log("this is")
    console.log(chosenWord)   
    res.send(chosenWord)   

}


catch(err){
	console.log(err)
}

})

app.get('/hive2', async (req, res)=>{
try
{
console.log("try harder")
const wordList = await fs.readFile('Phase2.csv', 'utf-8')
let chosenWord
console.log("trying")
    const wordArray = wordList.split(",")
    chosenWord = wordArray[Math.floor(Math.random() * wordArray.length)]
    const words = wordList.replace(","+chosenWord, "")
    fs.writeFile('Phase2.csv', words)
    console.log("this is")
    console.log(chosenWord)   
    res.send(chosenWord)   

}


catch(err){
	console.log(err)
}

})
app.get('/hive3', async (req, res)=>{
try
{
console.log("try harder")
const wordList = await fs.readFile('Phase3.csv', 'utf-8')
let chosenWord
console.log("trying")
    const wordArray = wordList.split(",")
    chosenWord = wordArray[Math.floor(Math.random() * wordArray.length)]
    const words = wordList.replace(","+chosenWord, "")
    fs.writeFile('Phase3.csv', words)
    console.log("this is")
    console.log(chosenWord)   
    res.send(chosenWord)


}


catch(err){
	console.log(err)
}

})


app.post('/left', async (req, res) =>{
     console.log(req.body)
     const wordList = await fs.readFile(`Phase${req.body.phase}.csv`, 'utf-8')
   
    const words = wordList.replace(req.body.tried +",", "")
    fs.writeFile(`Phase${req.body.phase}.csv`, words)

    if(req.body.struggle){
       fs.appendFile("struggle-words.csv", (req.body.tried+','))
       console.log("wrote it!")
        const wrongWords = (await fs.readFile("struggle-words.csv", 'utf-8')).split(",")
        res.json(wrongWords)
    }
    else{
        fs.appendFile("done.csv", (req.body.tried+','))
        console.log("wrote it!")
        const doneWords = (await fs.readFile("done.csv", 'utf-8')).split(",")
        res.json(doneWords)
    }

})

app.get('/getWords', async (req, res)=>{
    const donewords = (await fs.readFile("done.csv", "utf-8")).split(",")
    const INwords = (await fs.readFile("struggle-words.csv", "utf-8")).split(",")
    
    const left = (donewords.length + INwords.length)
    res.json({donewords, INwords, left})

})

app.get("/testing", async  (req, res) =>{
    const Dict1 = (await fs.readFile("Dict1.csv", "utf-8")).split(",")
    const Dict2 = (await fs.readFile("Dict2.csv", "utf-8")).split(",")
    const Dict3 = (await fs.readFile("Dict3.csv", "utf-8")).split(",")
    const struggles = (await fs.readFile("struggle-words.csv", "utf-8")).split(",")
    const phase1 = []
    const phase2 = []
    const phase3 = []
    struggles.forEach((value) => {
        if(Dict1.includes(value)){
            phase1.push(value+",")
        }
         if(Dict2.includes(value)){
            phase2.push(value+",")
        }
         if(Dict3.includes(value)){
            phase3.push(value+",")
        }
    })
    fs.writeFile("Phase1.csv", phase1)
    fs.writeFile("Phase2.csv", phase2)
    fs.writeFile("Phase3.csv", phase3)
    res.send("Practice Mode Initialized")
})

app.get("/spaced-repetition", async  (req, res) =>{
    const wrong = (await fs.readFile("struggle-words.csv", "utf-8")).split(",")
    const done = (await fs.readFile("done.csv", "utf-8")).split(",")
    const mess = []
    for (let i = 0; i < Math.round(wrong.length); i++) {
    mess.push(wrong[i])
    }

    for (let i = 0; i < Math.round(done.length * .25); i++) {
        mess.push(done[Math.floor(Math.random() * (done.length-1))])
    }
    const word = mess[Math.floor(Math.random() * mess.length)]
    
    res.send(word)
})
app.get("/word-list", async (req, res)=>{
    const wordList = await fs.readFile('Phase1.csv', 'utf-8').split(",")
    res.json(wordList)

})
app.post("/writer", async (req, res)=>{
const word = req.body.chosenWord
const example = req.body.example
const POS = req.body.POS
const definition = req.body.definition


const defList = await fs.readFile('def.json')
const pushee = JSON.parse(defList)

pushee.push({word, definition, example, POS})
fs.writeFile("def.json", JSON.stringify(pushee))
res.send("help")
})

app.get("/reset", async (req, res)=>{
    const Dict1 = await fs.readFile("Dict1.csv", "utf-8")
    const Dict2 = await fs.readFile("Dict2.csv", "utf-8")
    const Dict3 = await fs.readFile("Dict3.csv", "utf-8")
    const P1 = await fs.writeFile("Phase1.csv", Dict1)
    const P2 = await fs.writeFile("Phase2.csv", Dict2)
    const P3 = await fs.writeFile("Phase3.csv", Dict3)
    
    await fs.writeFile("done.csv", " ")
    await fs.writeFile("struggle-words.csv", " ")

    res.send("successfully-reset")

})


const PORT = process.env.PORT || 3000 

app.listen(PORT, (err, next)=>{
    if(err){console.log(err)}
    console.log('She might be listening...')
}
)



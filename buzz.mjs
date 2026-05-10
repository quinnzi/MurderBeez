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
    const words = wordList.replace(chosenWord, "")
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
    const words = wordList.replace(chosenWord, "")
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
    const words = wordList.replace(chosenWord, "")
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
   
    const words = wordList.replace(req.body.tried, "")
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
    const donewords = (await fs.readFile("done.csv", "utf-8")).toString()
    const INwords = (await fs.readFile("struggle-words.csv", "utf-8")).toString()
    res.json({donewords, INwords})

})
const PORT = process.env.PORT || 3000 

app.listen(PORT, (err, next)=>{
    if(err){console.log(err)}
    console.log('She might be listening...')
}
)

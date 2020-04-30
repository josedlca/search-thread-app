var Twitter = require('twitter');
const path = require('path')
const express= require('express')
const hbs = require('hbs')
const app = express()

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'./public')
const viewsPath = path.join(__dirname, './templates/views')
app.set('view engine', 'hbs')
app.set('views',viewsPath)
app.use(express.static(publicDirectoryPath))

app.get('',(req, res)=>{
  res.render('index',{
      title: 'Busca el hilo que quieres leer'
  })
})

var client = new Twitter({
    consumer_key:         'OtJj71h47lpE0050e3QLAGCRP',
    consumer_secret:      'zE2nl8xwG7cJJ9lxl5Nf1bfJW1ohc1kgq08K31Xgc0VV9FkIhX',
    access_token_key: '1246568866496512001-nZ9Rkg13zQ6xRclMKBAhkka6ZHUoQZ',
    access_token_secret: 'sNk7CkdBjw5ybnC5GWhPwVzkA1p7oA4Z4stBl3Tgi3Uh3'
  })
async function searchById(ansTwettId){
    let tweetValue
    try{
      tweetValue = await client.get('statuses/show/', {id:ansTwettId, tweet_mode:'extended'})
    }catch(e){
      tweetValue = await e
    }
    return tweetValue
}
let twettArr = []
async function searchThread(ansTwettId){
  if(ansTwettId != null){
    let takeDataTweet 
    try{
      takeDataTweet = await searchById(ansTwettId)
    }catch(e){
      takeDataTweet = await e
    }
    const dataJSON = JSON.stringify(takeDataTweet)
    const buffedData = dataJSON.toString()
    const twettObj = JSON.parse(buffedData)  
    twettArr.push({
      twettText:twettObj.full_text,
      dayOfTwetts: twettObj.created_at,
      userName: twettObj.user.name,
      userScreenName: twettObj.user.screen_name,
      like: twettObj.favorite_count,
      retweet: twettObj.retweet_count
    })
    if(twettObj.in_reply_to_status_id_str === null){
      app.get('/results',(req, res)=>{
        res.render('results',{
            allData: twettArr
        })
      })
    }else{
      searchThread(twettObj.in_reply_to_status_id_str)
    }
    return searchById(ansTwettId)
  }
}

searchThread('1255705036354699266')
// module.exports=searchThread
app.listen(port, ()=>{
  console.log(`server is up on port ${port}`)
})

const fetch = require("node-fetch")

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use('/public', express.static(path.join(__dirname, "public")))
  .use(express.urlencoded({ extended: false }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post("/getarticle", (req, res) => {

    if (req.body.articleurl == undefined || req.body.articleurl == null || req.body.articleurl == "") {
      res.status(500).send('No URL supplied!');
      return;
    }



    fetch(req.body.articleurl)
      .then((result) => result.text())
      .then((data) => {
        res.send(data);
      })
      .catch(error => {
        console.log("APP CRASHED");
        return;
      })


  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))



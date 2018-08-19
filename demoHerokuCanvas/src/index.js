const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5000;

//-- defined in the heroku configuration (if running on heroku)
//-- or defined in the .bashrc file (if running locally)
const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;

console.log(`consumer key[${CONSUMER_KEY}]`);
console.log(`consumer secret[${CONSUMER_SECRET}]`);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/lightningDesignSystem', (req, res) => res.render('pages/lightningDesignSystem'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

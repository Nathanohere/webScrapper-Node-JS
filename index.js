const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const port = process.env.PORT || 3000;

const website = 'https://www.jumia.com.ng';

try {
  axios.get(website).then((res) => {
    const data = res.data;
    // console.log(data);

    const $ = cheerio.load(data);

    let content = [];

    const deals = $('.prd');

    deals.each(function () {
      // const title = $(this).text().split('\n');
      const url = $(this).find('a').attr('href');
      const name = $(this).find('a').data('name');
      const price = $(this).find('a').data('price');

      content.push({ url, name, price });
      app.get('/scrape', (req, res) => {
        res.status(200).json(content);
      });
    });
    console.log(content);
  });
} catch (error) {
  console.log(error, error.message);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

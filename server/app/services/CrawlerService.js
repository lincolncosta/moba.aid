const axios = require('axios');
const cheerio = require('cheerio');
const LOL = 'lol';
const Champion = require('../models/Champion');

class CrawlerService {
  async start(game) {
    if (game == LOL) {
      const champions = await Champion.find();

      champions.map(async champion => {
        axios(process.env.SCRAPY_BASE_URL + champion.name)
          .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const statsTable = $('#statistics-win-rate-row td').eq(1);

            let splitedPath = response.request.path.split('/');
            let role = splitedPath[splitedPath.length - 1]
              .slice(0, -1)
              .toLowerCase();
            let winrate = statsTable
              .text()
              .slice(0, -1)
              .trim();

            console.log(role);
            console.log(winrate);
          })
          .catch(console.error);
      });
    }
  }
}

module.exports = new CrawlerService();

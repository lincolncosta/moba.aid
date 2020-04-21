const axios = require('axios');
const cheerio = require('cheerio');
const Champion = require('../models/Champion');

// Mapeando as roles existentes no ChampionGG em comparação com o MOBA AID.
const rolesMap = {
  top: 'top',
  jungle: 'jungler',
  middle: 'mid',
  adc: 'carry',
  support: 'support',
};
const rolesMapKeys = Object.values(rolesMap);

class CrawlerService {
  async updateChampion(champion) {
    await Champion.updateOne(
      {
        name: champion.name,
      },
      {
        $set: {
          infos: champion.infos,
        },
      },
    );
  }

  async updateInfosLeague() {
    const champions = await Champion.find();

    champions.map(async champion => {
      let championWinRates = champion.infos[0].winrate;

      axios(process.env.SCRAPY_BASE_URL + champion.name).then(
        async response => {
          const html = response.data;
          const $ = cheerio.load(html);
          const statsTable = $('#statistics-win-rate-row td').eq(1);

          let splitedPath = response.request.path.split('/');
          let role = splitedPath[splitedPath.length - 1]
            .slice(0, -1)
            .toLowerCase();
          let winrate = Number(
            statsTable
              .text()
              .trim()
              .slice(0, -1),
          );

          championWinRates = {};

          rolesMapKeys.map(role => {
            championWinRates[role] = 0;
          });

          championWinRates[rolesMap[role]] = winrate;

          await this.updateChampion(champion);
        },
      );
    });
  }

  async updateInfosDota() {
    // TO-DO.
  }

  async sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}

module.exports = new CrawlerService();

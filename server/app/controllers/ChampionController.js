const Champion = require('../models/Champion');

module.exports = {
  async index(req, res) {
    const champions = await Champion.find();
    return res.json(champions);
  },

  async store(req, res) {
    const {
      name,
      infos,
      roles,
      lanes,
      title,
      description,
      counters,
      id_ddragon,
      icon,
    } = req.body;

    const champion = await Champion.create({
      name,
      infos,
      roles,
      lanes,
      title,
      description,
      counters,
      id_ddragon,
      icon,
    });

    return res.json(champion);
  },

  async update(req, res) {
    const { name, infos } = req.body;

    await Champion.updateOne(
      {
        name: name,
      },
      {
        $set: {
          infos: infos,
        },
      },
    );

    return res.json({ message: 'Champion updated' });
  },
};

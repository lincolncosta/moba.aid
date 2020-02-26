const Champion = require('../models/Champion');

module.exports = {
    async index(req, res) {
        const { id_ddragon } = req.query;
        let champions = null;

        if (id_ddragon) {
            champions = await Champion.findOne({ id_ddragon });
        } else {
            champions = await Champion.find();
        }

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
};

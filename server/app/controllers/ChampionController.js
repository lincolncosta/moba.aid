const Champion = require('../models/Champion');

module.exports = {
    async store(championRequested) {
        const { name, infos, roles, lanes, title, description, counters, id_ddragon, icon } = championRequested;

        const champion = await Champion.create({
            name,
            infos,
            roles,
            lanes,
            title,
            description,
            counters,
            id_ddragon,
            icon
        });

        return res.json(champion);
    }
};
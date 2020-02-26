const Champion = require('../models/Champion');

module.exports = {
    async index(req, res) {
        const { id_ddragon } = req.query;

        const champions = await Champion.findOne({ id_ddragon });
        return champions;
    }
}
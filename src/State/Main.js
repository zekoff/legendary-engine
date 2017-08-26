/* global phsr, game */
var Planet = require('../Entity/Planet');
module.exports = {
    create: function() {
        game.layers = {};
        game.layers.military = phsr.add.group();
        game.layers.commerce = phsr.add.group();
        game.layers.research = phsr.add.group();
        game.nodes = phsr.add.group();
        new Planet(150, 150);
        new Planet(250, 400);
        new Planet(200, 700);
        new Planet(500, 250);
        new Planet(550, 550);
        new Planet(800, 650);
        new Planet(750, 300);
        new Planet(1050, 200);
        new Planet(1000, 450);
    }
};

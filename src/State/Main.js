/* global phsr, game */
var Planet = require('../Entity/Planet');
var Link = require('../Entity/Link');
var Hud = require('../Entity/Hud');
var SystemDefinition = require('../Data/SystemDefinition');
module.exports = {
    create: function() {
        game.selectionLayer = phsr.add.group();
        game.layers = {};
        game.layers.military = phsr.add.group();
        game.layers.commerce = phsr.add.group();
        game.layers.research = phsr.add.group();
        game.links = phsr.add.group();
        game.nodes = phsr.add.group();
        game.hud = new Hud();
        var i = 0;
        SystemDefinition.planets.forEach(function(planet) {
            game.nodes.add(new Planet(i++, planet.x, planet.y));
        });
        SystemDefinition.links.forEach(function(link) {
            game.links.add(new Link(link[0], link[1]));
        });
        game.money = 3000;
    }
};

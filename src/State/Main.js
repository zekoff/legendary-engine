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
            game.nodes.add(new Planet(i++, planet.x, planet.y, planet.owner));
        });
        SystemDefinition.links.forEach(function(link) {
            game.links.add(new Link(link[0], link[1]));
        });
        i = 0;
        game._money = 0;
        Object.defineProperty(game, 'money', {
            get: function() {
                return this._money;
            },
            set: function(val) {
                this._money = val;
                game.hud.moneyText.text = "Money: " + val;
            }
        });
        game.money = 3000;
        game._selectedPlanet = null;
        Object.defineProperty(game, 'selectedPlanet', {
            get: function() {
                return this._selectedPlanet;
            },
            set: function(val) {
                this._selectedPlanet = val;
                game.hud.setSelectedPlanet(val);
            }
        });
    }
};

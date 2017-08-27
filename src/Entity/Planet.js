/* global Phaser, phsr, game */
var Ship = require('./Ship');

var Planet = function(id, x, y) {
    Phaser.Sprite.call(this, phsr, x, y, 'planet');
    this.id = id;
    this.height = 100;
    this.width = 100;
    this.anchor.set(0.5);
    game.nodes.add(this);
    [{ name: 'military', tint: 0xff0000 }, { name: 'commerce', tint: 0x00ff00 },
        { name: 'research', tint: 0x0000ff }
    ].forEach(function(e) {
        var a = this[e.name + 'Aura'] = phsr.add.image(x, y, 'aura');
        game.layers[e.name].add(a);
        a.tint = e.tint;
        a.alpha = 0.3;
        a.height = 200;
        a.width = 200;
        a.anchor.set(0.5);
    }, this);
    this.inputEnabled = true;
    this.events.onInputDown.add(function() {
        if (!game.selectedPlanet) {
            game.selectionImage = phsr.add.image(this.x, this.y, 'planet');
            game.selectionLayer.add(game.selectionImage);
            game.selectionImage.tint = 0xff0000;
            game.selectionImage.width = 150;
            game.selectionImage.height = 150;
            game.selectionImage.alpha = 0.3;
            game.selectionImage.anchor.set(0.5);
            game.selectionImageTween = phsr.tweens.create(game.selectionImage)
                .to({ width: 200, height: 200, alpha: 0.5 }, 1000,
                    Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
            game.selectedPlanet = this;
            game.hud.setSelectedPlanet(game.selectedPlanet);
            print('new planet selected: ', game.selectedPlanet.id);
        }
        else {
            if (this.isLinkedTo(game.selectedPlanet.id))
                game.selectedPlanet.sendShips(this.id);
                game.selectionImageTween.stop();
                game.selectionImage.destroy();
            game.selectedPlanet = null;
            game.hud.setSelectedPlanet(game.selectedPlanet);
        }
    }, this);
    this.orbitedBy = [];
    
    this.timeTillShipSpawn = this.shipProductionRate = 1; // produce ship every X seconds
};
Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.constructor = Planet;
Planet.prototype.sendShips = function(planetId) {
    var targetPlanet = game.nodes.getAt(planetId);
    if (targetPlanet.id != planetId) print("ERROR: planet ID mismatch");
    this.orbitedBy.forEach(function(ship) {
        ship.planetOrbited = null;
        var moveTween = phsr.tweens.create(ship);
        moveTween.to({ x: targetPlanet.x, y: targetPlanet.y }, 1000);
        moveTween.onComplete.add(function(ship) {
            ship.enterOrbit(planetId);
        });
        moveTween.start();
    }, this);
    this.orbitedBy = [];
};
Planet.prototype.isLinkedTo = function(targetPlanetId) {
    var i;
    for (i = 0; i < game.links.length; i++)
        if (game.links.getAt(i).pair.includes(this.id) && game.links.getAt(i)
            .pair.includes(targetPlanetId))
            return true;
    return false;
};
Planet.prototype.update =function(){
    this.timeTillShipSpawn -= phsr.time.physicsElapsed;
    if (this.timeTillShipSpawn <= 0) {
        new Ship(this.id);
        this.timeTillShipSpawn = this.shipProductionRate;
    }
};

module.exports = Planet;

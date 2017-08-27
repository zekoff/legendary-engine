/* global Phaser, phsr, game */
var Planet = function(id, x, y) {
    Phaser.Sprite.call(this, phsr, x, y, 'planet');
    this.id = id;
    this.height = 100;
    this.width = 100;
    this.anchor.set(0.5);
    game.nodes.add(this);
    [{ name: 'military', tint: 0xff0000 }, { name: 'commerce', tint: 0x00ff00 }, { name: 'research', tint: 0x0000ff }].forEach(function(e) {
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
        print(this.id);
        if (!game.selectedPlanet) {
            game.selectedPlanet = this;
            print('new planet selected: ', game.selectedPlanet.id);
        }
        else {
            if (this.isLinkedTo(game.selectedPlanet.id))
                game.selectedPlanet.sendShips(this.id);
            game.selectedPlanet = null;
        }
    }, this);
    this.orbitedBy = [];
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
        if (game.links.getAt(i).pair.includes(this.id) && game.links.getAt(i).pair.includes(targetPlanetId))
            return true;
    return false;
};

module.exports = Planet;

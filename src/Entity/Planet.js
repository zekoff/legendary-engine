/* global Phaser, phsr, game */
var Planet = function(x, y) {
    Phaser.Sprite.call(this, phsr, x, y, 'planet');
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
};
Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.constructor = Planet;

module.exports = Planet;

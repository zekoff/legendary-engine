/* global Phaser, phsr, game */
var Ship = function(orbitId) {
    Phaser.Sprite.call(this, phsr, 0, 0, 'pix');
    game.layers.military.add(this);
    this.tint = 0xff0000;
    this.height = 4;
    this.width = 4;
    this.planetOrbited = game.nodes.getAt(orbitId);
    this.orbitDistance = phsr.rnd.between(60, 90);
    this.anchor.x = this.orbitDistance / this.width;
    this.angle = phsr.rnd.between(0, 360);
    this.orbiting = true;
    this.x = this.planetOrbited.x;
    this.y = this.planetOrbited.y;
    this.orbitSpeed = phsr.rnd.between(10, 40);
    this.orbitDirection = phsr.rnd.pick([-1, 1]);
};
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.constructor = Ship;
Ship.prototype.update = function() {
    if (!this.planetOrbited) return;
    this.angle += this.orbitSpeed * this.orbitDirection * phsr.time.physicsElapsed;
    if (phsr.rnd.frac() > 0.99) print(this.x);
};

module.exports = Ship;

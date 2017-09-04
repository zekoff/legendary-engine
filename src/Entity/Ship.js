/* global Phaser, phsr, game */
var Ship = function(planetId) {
    Phaser.Sprite.call(this, phsr, 0, 0, 'pix');
    game.layers.military.add(this);
    this.tint = 0xff0000;
    this.height = 4;
    this.width = 4;
    this.orbitDistance = phsr.rnd.between(60, 90);
    this.owner = game.nodes.getAt(planetId).owner;
    this.enterOrbit(planetId);
    switch (this.owner) {
        case "PLAYER":
            this.tint = 0x0000ff;
            break;
        case "ENEMY":
            this.tint = 0xff0000;
            break;
        default:
            this.tint = 0x808080;
    }
    this.anchor.set(0.5);
    this.angle = phsr.rnd.between(0, 360);
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
    findRotatedPoint(this.offsetPoint, this.planetOrbited, this.rotation).copyTo(this);
};
Ship.prototype.enterOrbit = function(planetId) {
    this.planetOrbited = game.nodes.getAt(planetId);
    this.planetOrbited.orbitedBy[this.owner.toLowerCase() + "Ships"].add(this);
    this.offsetPoint = { x: this.planetOrbited.x + this.orbitDistance, y: this.planetOrbited.y };
};

var findRotatedPoint = function(offsetPoint, centerPoint, radians) {
    var x = Math.cos(radians) * (offsetPoint.x - centerPoint.x) -
        Math.sin(radians) * (offsetPoint.y - centerPoint.y) + centerPoint.x;
    var y = Math.sin(radians) * (offsetPoint.x - centerPoint.x) +
        Math.cos(radians) * (offsetPoint.y - centerPoint.y) + centerPoint.y;
    return new Phaser.Point(x, y);
};

module.exports = Ship;

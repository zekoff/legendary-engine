/* global Phaser, phsr, game */
var layers = [
    { name: 'military', color: 0xff0000 },
    { name: 'commerce', color: 0x00ff00 },
    { name: 'research', color: 0x0000ff }
];

var Link = function(start, end) {
    Phaser.Group.call(this, phsr);
    this.pair = [start, end];
    this.start = game.nodes.getAt(start);
    this.end = game.nodes.getAt(end);
    game.links.add(this);
    this.base = phsr.add.image(0, 0, 'pix');
    this.base.height = 3;
    this.base.anchor.set(0, 0.5);
    this.base.x = this.start.x;
    this.base.y = this.start.y;
    this.base.width = Phaser.Math.distance(this.start.x, this.start.y, this.end.x, this.end.y);
    this.base.rotation = Phaser.Math.angleBetween(this.start.x, this.start.y, this.end.x, this.end.y);
    this.base.alpha = 0.4;
    this.add(this.base);
    this.pulseTween = phsr.tweens.create(this.base).to({ alpha: 0.2 }, 4000, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
};
Link.prototype = Object.create(Phaser.Group.prototype);
Link.constructor = Link;
Link.prototype.addLink = function(layerName) {
    var layer = layers.filter(function(e) { return e.name == layerName; })[0];
    var newLink = phsr.add.image(this.base.x, this.base.y, 'pix');
    newLink.height = 9;
    newLink.anchor.set(0, 0.5);
    newLink.width = this.base.width;
    newLink.rotation = this.base.rotation;
    newLink.alpha = .8;
    newLink.tint = layer.color;
    game.layers[layerName].add(newLink);
    this[layerName] = newLink;
};
Link.prototype.removeLink = function(layerName) {
    if (!this[layerName]) return;
    this[layerName].destroy();
    this[layerName] = null;
};

module.exports = Link;

/* global Phaser, phsr, game */
var Link = function(start, end) {
    Phaser.Image.call(this, phsr, 0, 0, 'pix');
    this.start = game.nodes.getAt(start);
    this.end = game.nodes.getAt(end);
    game.links.add(this);
    this.height = 3;
    this.x = this.start.x;
    this.y = this.start.y;
    this.width = Phaser.Math.distance(this.start.x, this.start.y, this.end.x, this.end.y);
    this.rotation = Phaser.Math.angleBetween(this.start.x, this.start.y, this.end.x, this.end.y);
    this.alpha = 0.2;
    this.pulseTween = phsr.tweens.create(this).to({ alpha: 0.4 }, 4000, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
};
Link.prototype = Object.create(Phaser.Image.prototype);
Link.constructor = Link;

module.exports = Link;

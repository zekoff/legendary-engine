/* global Phaser, phsr, game */
var HEIGHT = 1000;
var WIDTH = 1200;
var layers = [
    { name: 'military', color: 0xff0000 },
    { name: 'commerce', color: 0x00ff00 },
    { name: 'research', color: 0x0000ff }
];
var hudFont = {
    fontSize: '16pt'
};

var Hud = function() {
    Phaser.Group.call(this, phsr);
    this.x = 0;
    this.y = 800;
    this.bg = phsr.add.image(0, 0, 'pix');
    this.bg.height = 200;
    this.bg.width = 1200;
    this.add(this.bg);

    this.selectedLayer = null;

    this.planetText = phsr.add.text(5, 5, "PLANET", hudFont);
    this.add(this.planetText);

    this.productionText = phsr.add.text(5, 35, "PRODUCTION", hudFont);
    this.add(this.productionText);

    this.orbitingText = phsr.add.text(5, 65, "SHIPS", hudFont);
    this.add(this.orbitingText);

    this.moneyText = phsr.add.text(5, 95, "Money: " + game.money, hudFont);
    this.add(this.moneyText);

    this.taxText = phsr.add.text(5, 125, "TAX RATE", hudFont);
    this.add(this.taxText);

    this.productionButton = phsr.add.image(600, 0, 'pix');
    this.productionButton.tint = 0x00ff00;
    this.productionButton.height = 50;
    this.productionButton.width = 400;
    this.add(this.productionButton);
    this.productionButton.inputEnabled = true;
    this.productionButton.events.onInputUp.add(function() {
        if (game.selectedPlanet &&
            game.selectedPlanet.shipProductionRate > 0.25 &&
            game.money >= 1000 &&
            game.selectedPlanet.owner == "PLAYER") {
            print('boosting production');
            game.money -= 1000;
            game.selectedPlanet.shipProductionRate -= 0.25;
        }
    });
    this.productionButtonText = phsr.add.text(605, 5, "INCREASE PRODUCTION");
    this.add(this.productionButtonText);

    var i = 0;
    layers.forEach(function(layer) {
        var button = phsr.add.image(WIDTH, 5 + 65 * i++, 'pix');
        button.anchor.set(1, 0);
        button.width = 80;
        button.height = 60;
        button.tint = layer.color;
        button.name = layer.name;
        this.add(button);
        button.inputEnabled = true;
        button.events.onInputUp.add(function() {
            this.setSelectedLayer(layer);
        }, this);
    }, this);
};
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.constructor = Hud;
Hud.prototype.setSelectedPlanet = function(planet) {
    this.planetText.text = "Selected Planet: " + (planet ? planet.id : "NONE");
    this.productionText.text = "Production Level: " + (planet ? planet.shipProductionRate : "NONE");
    this.orbitingText.text = "Ships in Orbit: " + (planet ? planet.orbitedBy.playerShips.length : "NONE");
    this.moneyText.text = "Money: " + game.money;
    this.taxText.text = "Tax Rate: " + (planet ? planet.taxRate : "NONE");
};
Hud.prototype.setSelectedLayer = function(layer) {
    var button = this.getByName(layer.name);
    var t;
    // null layer (standard)
    if (layer.name == this.selectedLayer) {
        this.selectedLayer = null;
        this.bg.tint = 0xffffff;
        t = phsr.tweens.create(button);
        t.to({ width: 80 }, 100);
        t.onStart.add(function() { game.hud.ignoreChildInput = true; });
        t.onComplete.add(function() { game.hud.ignoreChildInput = false; });
        t.start();
        layers.forEach(function(layer) {
            phsr.tweens.create(game.layers[layer.name]).to({ alpha: 0.1 }, 100, null, true);
        }, this);
        return;
    }
    this.selectedLayer = layer.name;
    this.bg.tint = mixColors(layer.color, 0xffffff, 80);
    t = phsr.tweens.create(button);
    t.to({ width: 120 }, 100);
    t.onStart.add(function() { game.hud.ignoreChildInput = true; });
    t.onComplete.add(function() { game.hud.ignoreChildInput = false; });
    t.start();
    var twn = phsr.tweens.create(game.layers[layer.name]);
    twn.to({ alpha: 1 }, 100);
    twn.onStart.add(function() {
        print('starting layer tween to alpha 1');
        print(game.layers[layer.name].alpha);
    });
    twn.onComplete.add(function() {
        print('completed layer tween to alpha 1');
        print(game.layers[layer.name].alpha);
    });
    twn.start();
    layers.filter(function(e) { return e.name != layer.name; }, this)
        .forEach(function(e) {
            phsr.tweens.create(this.getByName(e.name)).to({ width: 80 }, 100, null, true);
            phsr.tweens.create(game.layers[e.name]).to({ alpha: 0.1 }, 100, null, true);
        }, this);
};

var mixColors = function(a, b, weight) {
    // weight is how much the blend should favor B. 0 = all A, 100 = all B
    if (weight === undefined) weight = 50;
    var A = Phaser.Color.getRGB(a);
    var B = Phaser.Color.getRGB(b);
    return Phaser.Color.interpolateRGB(A.r, A.g, A.b, B.r, B.g, B.b, 100, weight);
};

module.exports = Hud;

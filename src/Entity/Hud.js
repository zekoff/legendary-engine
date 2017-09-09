/* global Phaser, phsr, game */
var HEIGHT = 1000;
var WIDTH = 1200;
var layers = [{ name: 'military', color: 0xff0000 },
    { name: 'commerce', color: 0x00ff00 },
    { name: 'research', color: 0x0000ff }
];

var Hud = function() {
    Phaser.Group.call(this, phsr);
    this.x = 0;
    this.y = 800;
    this.bg = phsr.add.image(0, 0, 'pix');
    this.bg.height = 200;
    this.bg.width = 1200;
    this.add(this.bg);

    this.selectedLayer = null;

    this.planetText = phsr.add.text(5, 5, "PLANET");
    this.add(this.planetText);

    this.productionText = phsr.add.text(5, 45, "PRODUCTION");
    this.add(this.productionText);

    this.orbitingText = phsr.add.text(5, 85, "SHIPS");
    this.add(this.orbitingText);

    this.moneyText = phsr.add.text(5, 125, "Money: " + game.money);
    this.add(this.moneyText);

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
};
Hud.prototype.setSelectedLayer = function(layer) {
    var button = this.getByName(layer.name);
    var t;
    // null layer (standard)
    if (layer.name == this.selectedLayer) {
        this.selectedLayer = null;
        this.bg.tint = 0xffffff;
        t = phsr.tweens.create(button);
        t.to({ width: 80 }, 200);
        t.onStart.add(function() { game.hud.ignoreChildInput = true; });
        t.onComplete.add(function() { game.hud.ignoreChildInput = false; });
        t.start();
        print('selected layer: ', this.selectedLayer);
        return;
    }
    // activate new layer
    this.selectedLayer = layer.name;
    // TODO this.bg.tint = layer.color;
    t = phsr.tweens.create(button);
    t.to({ width: 120 }, 200);
    t.onStart.add(function() { game.hud.ignoreChildInput = true; });
    t.onComplete.add(function() { game.hud.ignoreChildInput = false; });
    t.start();
    // collapse old layers, if applicable
    layers.filter(function(e) { return e.name != layer.name; }, this)
        .forEach(function(e) {
            phsr.tweens.create(this.getByName(e.name)).to({ width: 80 }, 200, null, true);
        }, this);
    print('selected layer: ', this.selectedLayer);
};

module.exports = Hud;

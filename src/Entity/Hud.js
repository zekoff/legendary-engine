/* global Phaser, phsr, game */
var Hud = function() {
    Phaser.Group.call(this, phsr);
    this.x = 0;
    this.y = 800;
    this.bg = phsr.add.image(0, 0, 'pix');
    this.bg.height = 200;
    this.bg.width = 1200;
    this.add(this.bg);

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
            game.money >= 1000) {
            print('boosting production');
            game.money -= 1000;
            game.selectedPlanet.shipProductionRate -= 0.25;
        }
    });
    this.productionButtonText = phsr.add.text(605, 5, "INCREASE PRODUCTION");
    this.add(this.productionButtonText);
};
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.constructor = Hud;
Hud.prototype.setSelectedPlanet = function(planet) {
    this.planetText.text = "Selected Planet: " + (planet ? planet.id : "NONE");
    this.productionText.text = "Production Level: " + (planet ? planet.shipProductionRate : "NONE");
    this.orbitingText.text = "Ships in Orbit: " + (planet ? planet.orbitedBy.length : "NONE");
    this.moneyText.text = "Money: " + game.money;
};

module.exports = Hud;

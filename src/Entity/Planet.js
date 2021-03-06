/* global Phaser, phsr, game */
var Ship = require('./Ship');

var Planet = function(id, x, y, owner) {
    Phaser.Sprite.call(this, phsr, x, y, 'planet');
    this.id = id;
    this.height = 100;
    this.width = 100;
    this.anchor.set(0.5);
    game.nodes.add(this);
    this.setOwner(owner);
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
    this.events.onInputOver.add(function(target) {
        print('over planet ', this.id);
        game.hud.lastOverPlanet = this;
    }, this);
    this.events.onInputOut.add(function() {
        print('out of planet ', this.id);
    }, this);
    this.events.onInputUp.add(function() {
        print('input up on planet ', this.id);
        if (game.hud.lastOverPlanet && this.id != game.hud.lastOverPlanet.id)
            print('dragged between 2 planets!');
        if (game.hud.lastOverPlanet && this.id != game.hud.lastOverPlanet.id &&
            this.isLinkedTo(game.hud.lastOverPlanet.id)) {
            print('dragged between 2 connected planets!');
            if (game.hud.selectedLayer) {
                var link = this.getLinkBetween(this, game.hud.lastOverPlanet);
                if (game.hud.selectedLayer == 'military') {
                    if (link['military']) link.removeLink('military');
                    else link.addLink('military', this, game.hud.lastOverPlanet);
                }
                else if (this.owner == 'PLAYER' && game.hud.lastOverPlanet.owner == 'PLAYER') {
                    if (link[game.hud.selectedLayer]) link.removeLink(game.hud.selectedLayer);
                    else link.addLink(game.hud.selectedLayer, this, game.hud.lastOverPlanet);
                }
            }
        }
        if (!game.selectedPlanet) {
            game.selectionImage = phsr.add.image(this.x, this.y, 'planet');
            game.selectionLayer.add(game.selectionImage);
            game.selectionImage.tint = 0x8080ff;
            game.selectionImage.width = 200;
            game.selectionImage.height = 200;
            game.selectionImage.alpha = 0.6;
            game.selectionImage.anchor.set(0.5);
            game.selectionImageTween = phsr.tweens.create(game.selectionImage)
                .to({ width: 250, height: 250, alpha: 0.4 }, 1000,
                    Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
            game.selectedPlanet = this;
        }
        else {
            if (game.hud.selectedLayer == "military")
                if (this.isLinkedTo(game.selectedPlanet.id) &&
                    game.selectedPlanet.id != this.id)
                    game.selectedPlanet.sendShips(this.id);
            if (game.hud.selectedLayer == "commerce" &&
                this.isLinkedTo(game.selectedPlanet.id) &&
                this.owner == "PLAYER" &&
                game.selectedPlanet.id != this.id &&
                game.money >= 500)
                game.selectedPlanet.sendTradeMission(this.id);
            game.selectionImageTween.stop();
            game.selectionImage.destroy();
            game.selectedPlanet = null;
        }
        game.hud.lastOverPlanet = null;
    }, this);
    this.orbitedBy = {};
    this.orbitedBy.playerShips = phsr.add.group();
    this.orbitedBy.enemyShips = phsr.add.group();
    this.orbitedBy.neutralShips = phsr.add.group();

    var rate = 0;
    switch (this.owner) {
        case "PLAYER":
            rate = 1;
            break;
        case "ENEMY":
            rate = .1;
            break;
        case "NEUTRAL":
            rate = 2;
            break;
    }
    this.timeTillShipSpawn = this.shipProductionRate = rate; // produce ship every X seconds
    this.taxRate = 15; // money per second
};
Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.constructor = Planet;
Planet.prototype.sendShips = function(planetId, limit) {
    if (!limit) limit = this.orbitedBy.playerShips.length;
    var shipsSent = 0;
    var targetPlanet = game.nodes.getAt(planetId);
    if (targetPlanet.id != planetId) print("ERROR: planet ID mismatch");
    this.orbitedBy.playerShips.forEach(function(ship) {
        if (shipsSent++ > limit) return;
        ship.planetOrbited = null;
        var moveTween = phsr.tweens.create(ship);
        moveTween.to({ x: targetPlanet.x, y: targetPlanet.y }, 7000);
        moveTween.onComplete.add(function(ship) {
            ship.enterOrbit(planetId);
        });
        moveTween.start();
    }, this);
    var i;
    for (i = 0; i < limit; i++) phsr.world.add(this.orbitedBy.playerShips.getAt(0));
    // phsr.world.addMultiple(this.orbitedBy.playerShips);
};
Planet.prototype.sendTradeMission = function(planetId, passive) {
    game.money -= passive ? 0 : 500;
    var targetPlanet = game.nodes.getAt(planetId);
    if (targetPlanet.id != planetId) print("ERROR");
    var tradeVessel = phsr.add.sprite(this.x + phsr.rnd.between(-30, 30), this.y + phsr.rnd.between(-10, 10), 'pix');
    tradeVessel.anchor.set(0.5);
    tradeVessel.height = passive ? 4 : 10;
    tradeVessel.width = passive ? 4 : 10;
    tradeVessel.tint = 0x00ff00;
    var t = phsr.tweens.create(tradeVessel);
    t.to({ x: targetPlanet.x, y: targetPlanet.y }, passive ? 5000 : 3000);
    t.onComplete.add(function() {
        targetPlanet.taxRate += passive ? .1 : 5;
        tradeVessel.destroy();
    });
    t.start();
};
Planet.prototype.isLinkedTo = function(targetPlanetId) {
    var i;
    for (i = 0; i < game.links.length; i++)
        if (game.links.getAt(i).pair.includes(this.id) && game.links.getAt(i)
            .pair.includes(targetPlanetId))
            return true;
    return false;
};
Planet.prototype.getLinkBetween = function(a, b) {
    var i;
    for (i = 0; i < game.links.length; i++)
        if (game.links.getAt(i).pair.includes(a.id) && game.links.getAt(i)
            .pair.includes(b.id))
            return game.links.getAt(i);
    return null;
};
Planet.prototype.setOwner = function(owner) {
    if (!owner) owner = "NEUTRAL";
    switch (owner) {
        case "PLAYER":
            this.tint = 0x8080ff;
            break;
        case "ENEMY":
            this.tint = 0xff8080;
            break;
        default:
            this.tint = 0xffffff;
    }
    this.owner = owner;
};
Planet.prototype.update = function() {
    this.timeTillShipSpawn -= phsr.time.physicsElapsed;
    if (this.timeTillShipSpawn <= 0) {
        new Ship(this.id);
        this.timeTillShipSpawn = this.shipProductionRate;
    }

    // SHIP COMBAT
    var i = 0,
        battles = 0;
    // Player/Enemy
    battles = Math.min(this.orbitedBy.playerShips.length, this.orbitedBy.enemyShips.length);
    if (battles > 0) {
        for (i = 0; i < battles; i++) {
            /// TODO make the ships visually enter combat with each other
            this.orbitedBy.playerShips.getAt(0).destroy();
            this.orbitedBy.enemyShips.getAt(0).destroy();
        }
    }
    // Enemy/Neutral
    battles = Math.min(this.orbitedBy.enemyShips.length, this.orbitedBy.neutralShips.length);
    if (battles > 0) {
        for (i = 0; i < battles; i++) {
            this.orbitedBy.enemyShips.getAt(0).destroy();
            this.orbitedBy.neutralShips.getAt(0).destroy();
        }
    }
    // Player/Neutral
    battles = Math.min(this.orbitedBy.playerShips.length, this.orbitedBy.neutralShips.length);
    if (battles > 0) {
        for (i = 0; i < battles; i++) {
            this.orbitedBy.playerShips.getAt(0).destroy();
            this.orbitedBy.neutralShips.getAt(0).destroy();
        }
    }

    // OWNERSHIP TRANSITION
    // Player
    if (this.orbitedBy.playerShips.length > 0 &&
        this.owner != "PLAYER" &&
        this.orbitedBy.enemyShips.length == 0 &&
        this.orbitedBy.neutralShips.length == 0) this.setOwner("PLAYER");
    // Enemy
    if (this.orbitedBy.enemyShips.length > 0 &&
        this.owner != "ENEMY" &&
        this.orbitedBy.playerShips.length == 0 &&
        this.orbitedBy.neutralShips.length == 0) this.setOwner("ENEMY");

    // MONEY
    if (this.owner == "PLAYER") game.money += phsr.time.physicsElapsed * this.taxRate;

    // PASSIVE SHIP TRANSIT
    // Military
    // get military links out from this planet
    game.links.children.filter(function(link) { return link['military']; }, this)
        .filter(function(link) { return link['military'].startPlanet == this; }, this)
        .forEach(function(link) {
            var mLink = link['military'];
            mLink.passiveTimer -= phsr.time.physicsElapsed;
            if (mLink.passiveTimer <= 0) {
                mLink.passiveTimer = mLink.maxPassiveTimer;
                if (this.orbitedBy.playerShips.length > 0)
                    this.sendShips(mLink.endPlanet.id, 1);
            }
        }, this);
    // Trade
    game.links.children.filter(function(link) { return link['commerce']; }, this)
        .filter(function(link) { return link['commerce'].startPlanet == this; }, this)
        .forEach(function(link) {
            var cLink = link['commerce'];
            cLink.passiveTimer -= phsr.time.physicsElapsed;
            if (cLink.passiveTimer <= 0) {
                cLink.passiveTimer = cLink.maxPassiveTimer;
                this.sendTradeMission(cLink.endPlanet.id, true);
            }
        }, this);
};

module.exports = Planet;

/* global Phaser */
var game = new Phaser.Game(1200, 800);
var print = console.log.bind(console);
global.game = game;
global.node = {};
global.print = print;
game.state.add('Load', require('./State/Load'));
game.state.add('Main', require('./State/Main'));
game.state.start('Load');

/* global Phaser */
var phsr = new Phaser.Game(1200, 1000);
var print = console.log.bind(console);
global.phsr = phsr;
global.game = {};
global.print = print;
phsr.state.add('Load', require('./State/Load'));
phsr.state.add('Main', require('./State/Main'));
phsr.state.start('Load');

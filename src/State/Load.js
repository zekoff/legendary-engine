/* global game, Phaser */
module.exports = {
    preload: function() {
        game.input.maxPointers = 1;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.load.baseURL = './assets/';
        game.load.image('pix');
    },
    create: function() {
        game.state.start('Main');
    }
};

/* global phsr, Phaser */
module.exports = {
    preload: function() {
        phsr.input.maxPointers = 1;
        phsr.canvas.oncontextmenu = function(e) { e.preventDefault(); };
        phsr.scale.pageAlignHorizontally = true;
        phsr.scale.pageAlignVertically = true;
        phsr.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        phsr.load.baseURL = './assets/';
        phsr.load.image('pix');
        phsr.load.image('planet');
        phsr.load.image('aura');
    },
    create: function() {
        phsr.state.start('Main');
    }
};

module Ala3.Entity {
    export class Popup extends Phaser.Sprite {
        game: Game;

        onClose: Phaser.Signal;

        constructor(game, message: string) {
            super(game, -110, -98, 'popup');

            let text = new Phaser.Text(game, this.width / 2, this.height / 2, message, {
                font: '16px Arial',
                fill: '#000',
                boundsAlignH: 'center',
                boundsAlignV: 'middle'
            });

            this.addChild(text);

            this.inputEnabled = true;
        }
    }
}

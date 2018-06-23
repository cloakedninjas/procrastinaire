module Ala3.State {
    export class Game extends Phaser.State {
        create() {
            /*var img = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'phaser-logo');
            img.anchor.x = 0.5;
            img.anchor.y = 0.5;*/

            let solitaire = new Entity.Solitaire(this.game, 0 ,0);
            this.add.existing(solitaire);
        }
    }
}
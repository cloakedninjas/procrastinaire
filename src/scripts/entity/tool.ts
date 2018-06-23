module Ala3.Entity {
    export class Tool extends Phaser.Sprite {
        game: Game;

        constructor(game, x, y, key) {
            super(game, x, y, key);

            this.inputEnabled = true;
        }

        pickup() {
            //
        }
    }
}

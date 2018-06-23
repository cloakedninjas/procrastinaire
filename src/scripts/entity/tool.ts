module Ala3.Entity {
    export class Tool extends Phaser.Sprite {
        game: Game;
        id: number;

        constructor(game, x, y, key) {
            super(game, x, y, key);

            this.inputEnabled = true;
        }
    }
}

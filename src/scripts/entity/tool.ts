module Ala3.Entity {
    export class Tool extends Phaser.Sprite {
        static TASK_CLIP: number = 1;
        static TASK_PEN: number = 2;
        static TASK_SHRED: number = 3;
        static TASK_STAMP: number = 4;
        static TASK_STAPLER: number = 5;

        game: Game;
        id: number;

        constructor(game, x, y, key) {
            super(game, x, y, key);

            this.inputEnabled = true;
        }
    }
}

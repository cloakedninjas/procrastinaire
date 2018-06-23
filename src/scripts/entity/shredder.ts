module Ala3.Entity {
    export class Shredder extends Tool {
        constructor(game, x, y) {
            super(game, x, y, 'shredder');

            this.id = Paper.TASK_SHRED;
        }
    }
}

module Ala3.Entity {
    export class Stamp extends Tool {
        constructor(game, x, y) {
            super(game, x, y, 'stamp-desk');

            this.id = Paper.TASK_STAMP;
        }
    }
}

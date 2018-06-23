module Ala3.Entity {
    export class Pencup extends Tool {
        constructor(game, x, y) {
            super(game, x, y, 'pencup-desk');

            this.id = Paper.TASK_PEN;
        }
    }
}

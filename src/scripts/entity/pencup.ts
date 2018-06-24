module Ala3.Entity {
    export class Pencup extends Tool {
        constructor(game, x, y) {
            super(game, x, y, 'pencup');

            this.id = Tool.TASK_PEN;
        }
    }
}

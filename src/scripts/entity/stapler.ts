module Ala3.Entity {
    export class Stapler extends Tool {
        constructor(game, x, y) {
            super(game, x, y, 'stapler');

            this.id = Tool.TASK_STAPLER;
        }
    }
}

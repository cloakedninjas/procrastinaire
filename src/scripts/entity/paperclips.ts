module Ala3.Entity {
    export class Paperclips extends Tool {

        constructor(game, x, y) {
            super(game, x, y, 'paperclips-desk');

            this.id = Paper.TASK_CLIP;
        }
    }
}

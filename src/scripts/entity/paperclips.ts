module Ala3.Entity {
    export class Paperclips extends Tool {

        constructor(game, x, y) {
            super(game, x, y, 'paperclip-cup');

            this.id = Tool.TASK_CLIP;
        }
    }
}

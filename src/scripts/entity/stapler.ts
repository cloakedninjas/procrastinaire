module Ala3.Entity {
    export class Stapler extends Tool {
        game: Game;

        constructor(game, x, y) {
            super(game, x, y, 'stapler-desk');

        }
    }
}

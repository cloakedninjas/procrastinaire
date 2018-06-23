/// <reference path="../refs.d.ts" />

module Ala3 {
    export class Game extends Phaser.Game {

        constructor() {
            super({
                width: window.innerWidth,
                height: window.innerHeight,
                renderer: Phaser.AUTO
            });

            this.state.add('preloader', State.Preloader, true);
            this.state.add('game', State.Game);
        }
    }
}

// export Game to window
var Game = Ala3.Game;


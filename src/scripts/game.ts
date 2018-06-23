/// <reference path="../refs.d.ts" />

module Ala3 {
    export class Game extends Phaser.Game {

        constructor() {
            super({
                width: 1024,
                height: 768,
                renderer: Phaser.AUTO
            });

            this.state.add('preloader', State.Preloader, true);
            this.state.add('game', State.Game);
        }

        boot() {
            super.boot();
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        }
    }
}

// export Game to window
let Game = Ala3.Game;


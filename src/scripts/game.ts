/// <reference path="../refs.d.ts" />

module Ala3 {
    export class Game extends Phaser.Game {

        music: Phaser.Sound;

        constructor() {
            super({
                width: 1024,
                height: 768,
                renderer: Phaser.AUTO
            });

            this.state.add('preloader', State.Preloader, true);
            this.state.add('title', State.Title);
            this.state.add('game', State.Game);
            this.state.add('scores', State.Score);
        }

        boot() {
            super.boot();
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(0, 0, 1024, 768);
        }

        playMusic() {
            this.music = new Phaser.Sound(this, 'track-1', 0.6, true);
            this.music.play();
        }
    }
}

// export Game to window
let Game = Ala3.Game;


/// <reference path="../refs.d.ts" />

module Ala3 {
    export class Game extends Phaser.Game {

        music: any;
        currentMusic: Phaser.Sound;

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

            this.music = {};
            this.music[State.Game.DIFFICULTY_EASY] = new Phaser.Sound(this, 'track-1', 0.3, true);
            this.music[State.Game.DIFFICULTY_MEDIUM] = new Phaser.Sound(this, 'track-2', 0.3, true);
            this.music[State.Game.DIFFICULTY_HARD] = new Phaser.Sound(this, 'track-3', 0.3, true);
        }

        playMusic(difficulty:number) {
            if (!this.currentMusic) {
                this.currentMusic = this.music[difficulty];
            }

            if (!this.currentMusic.isPlaying) {
                this.currentMusic.play();
            } else {
                this.currentMusic.fadeOut(1000);
                this.currentMusic = this.music[difficulty];
                this.currentMusic.fadeIn(1000, true);
            }
        }
    }
}

// export Game to window
let Game = Ala3.Game;


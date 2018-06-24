module Ala3.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);

            this.load.image('title-screen', 'assets/images/title-screen.png');
            this.load.image('bg', 'assets/images/background.png');

            this.load.image('computer', 'assets/images/computer-screen.png');
            this.load.image('popup', 'assets/images/pop-up.png');
            this.load.image('computer-shine', 'assets/images/computer-shine.png');
            this.load.image('card-back', 'assets/images/card-back-tropical.png');
            this.load.image('card-front', 'assets/images/card-front.png');

            this.load.image('stapler', 'assets/images/stapler.png');
            this.load.image('paperclip-cup', 'assets/images/paperclip-cup.png');
            this.load.image('stamp-top', 'assets/images/stamp-top.png');
            this.load.image('shredder', 'assets/images/shredder.png');
            this.load.image('pencup', 'assets/images/pencup.png');
            this.load.image('paper-active', 'assets/images/paper-active.png');
            this.load.image('paper-inbox', 'assets/images/paper-inbox.png');
            this.load.image('tray-outer-inbox', 'assets/images/tray-outer-inbox.png');
            this.load.image('outbox', 'assets/images/outbox.png');
            this.load.image('postit', 'assets/images/postit.png');

            this.load.image('icon-paperclip', 'assets/images/icon-paperclip.png');
            this.load.image('icon-pen', 'assets/images/icon-pen.png');
            this.load.image('icon-shredder', 'assets/images/icon-shredder.png');
            this.load.image('icon-stamp', 'assets/images/icon-stamp.png');
            this.load.image('icon-staple', 'assets/images/icon-staple.png');

            this.load.image('paperclip-active', 'assets/images/paperclip-active.png');
            this.load.image('pen-active', 'assets/images/pen-active.png');
            this.load.image('stamp-active', 'assets/images/stamp-active.png');
            this.load.image('stapler-active', 'assets/images/stapler-active.png');

            this.load.image('paperclip', 'assets/images/paperclip.png');
            this.load.image('signature', 'assets/images/signature.png');
            this.load.image('stamp', 'assets/images/stamp.png');
            this.load.image('staple', 'assets/images/staple.png');

            this.load.image('clock-0', 'assets/images/clock-1.png');
            this.load.image('clock-1', 'assets/images/clock-2.png');
            this.load.image('clock-2', 'assets/images/clock-3.png');
            this.load.image('clock-3', 'assets/images/clock-4.png');
            this.load.image('clock-4', 'assets/images/clock-5.png');

            this.load.audio('ambient', 'assets/audio/ambient.mp3');
            this.load.audio('track-1', 'assets/audio/track-1.mp3');
            //this.load.audio('track-2', 'assets/audio/track-2.mp3');
            //this.load.audio('track-3', 'assets/audio/track-3.mp3');

            this.load.audio('paper-in', 'assets/audio/paper-in.mp3');
            this.load.audio('paper-out', 'assets/audio/paper-out.mp3');
            this.load.audio('paperclip', 'assets/audio/paperclip.mp3');
            this.load.audio('pick-up', 'assets/audio/pick-up.mp3');
            this.load.audio('put-down', 'assets/audio/put-down.mp3');
            this.load.audio('shred', 'assets/audio/shred.mp3');
            this.load.audio('sign', 'assets/audio/sign.mp3');
            this.load.audio('stamp', 'assets/audio/stamp.mp3');
            this.load.audio('stapler', 'assets/audio/stapler.mp3');
        }

        create() {
            this.loadingBar.setFillPercent(100);
            let tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('title', true, null, Game.DIFFICULTY_EASY);
        }

        loadUpdate() {
            this.loadingBar.setFillPercent(this.load.progress);
        }
    }
}

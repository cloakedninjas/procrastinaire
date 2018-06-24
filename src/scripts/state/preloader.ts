module Ala3.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);

            this.load.image('bg', 'assets/images/background.png');

            this.load.image('computer', 'assets/images/computer-screen.png');
            this.load.image('computer-shine', 'assets/images/computer-shine.png');
            this.load.image('card-back', 'assets/images/card-back-tropical.png');
            this.load.image('card-front', 'assets/images/card-front.png');

            this.load.image('stapler', 'assets/images/stapler.png');
            this.load.image('paperclips-desk', 'assets/images/paperclips-desk.png');
            this.load.image('stamp-desk', 'assets/images/stamp-desk.png');
            this.load.image('shredder', 'assets/images/shredder.png');
            this.load.image('pencup-desk', 'assets/images/pencup-desk.png');
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
        }

        create() {
            this.loadingBar.setFillPercent(100);
            let tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('game', true);
        }

        loadUpdate() {
            this.loadingBar.setFillPercent(this.load.progress);
        }
    }
}

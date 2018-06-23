module Ala3.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);

            this.load.image('bg', 'assets/images/background.png');

            this.load.image('computer', 'assets/images/computer-screen.png');
            this.load.image('card-back', 'assets/images/card-back-tropical.png');
            this.load.image('card-front', 'assets/images/card-front.png');

            this.load.image('stapler-desk', 'assets/images/stapler-desk.png');
            this.load.image('paperclips-desk', 'assets/images/paperclips-desk.png');
            this.load.image('shredder', 'assets/images/shredder.png');
            this.load.image('pencup-desk', 'assets/images/pencup-desk.png');
            this.load.image('paper-active', 'assets/images/paper-active.png');
            this.load.image('paper-inbox', 'assets/images/paper-inbox.png');
            this.load.image('tray-outer-inbox', 'assets/images/tray-outer-inbox.png');
            this.load.image('outbox', 'assets/images/outbox.png');
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

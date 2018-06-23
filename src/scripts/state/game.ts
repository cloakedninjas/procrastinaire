module Ala3.State {
    export class Game extends Phaser.State {
        cursorTool: Phaser.Sprite;

        create() {
            let bg = this.add.sprite(0, 0, 'mockup');
            bg.alpha = 0.6;

            let stapler = new Entity.Stapler(this.game, 429, 335);
            this.add.existing(stapler);

            stapler.events.onInputDown.add(this.onToolClick, this);

            /*
            pen-cup 210 x 254
            paperclips 288 x 397
            shredder 335 x 153

             */

            let solitaire = new Entity.Solitaire(this.game, 548 ,13);
            this.add.existing(solitaire);

            this.cursorTool = new Phaser.Sprite(this.game, 0, 0, 'stapler-desk');
            this.cursorTool.visible = false;
            this.add.existing(this.cursorTool);

        }

        update() {
            if (this.cursorTool.visible) {
                this.cursorTool.x = this.game.input.mousePointer.x;
                this.cursorTool.y = this.game.input.mousePointer.y;
            }
        }

        onToolClick(tool:Entity.Tool) {
            if (this.cursorTool.visible) {
                tool.alpha = 1;
                this.cursorTool.visible = false;
            } else {
                tool.alpha = 0.5;
                this.cursorTool.visible = true;
            }
        }
    }
}

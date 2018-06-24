module Ala3.State {
    export class Title extends Phaser.State {
        game:Ala3.Game;

        create() {
            this.add.sprite(0, 0, 'title-screen');

            let cardSize = {
                w: 109,
                h: 148
            };

            let y = 293;

            let buttons = {};

            buttons[Game.DIFFICULTY_EASY] = new Phaser.Rectangle(
                619,
                y,
                cardSize.w,
                cardSize.h
            );

            buttons[Game.DIFFICULTY_MEDIUM] = new Phaser.Rectangle(
                476,
                y,
                cardSize.w,
                cardSize.h
            );

            buttons[Game.DIFFICULTY_HARD] = new Phaser.Rectangle(
                762,
                y,
                cardSize.w,
                cardSize.h
            );

            this.game.input.onDown.add(function (pointer: Phaser.Pointer) {
                for (let b in buttons) {
                    let button = buttons[b];

                    if (button.contains(pointer.x, pointer.y)) {
                        this.startGame(parseInt(b));
                        break;
                    }
                }
            }, this);

            this.game.playMusic();
        }

        startGame(difficulty: number) {
            this.game.state.start('game', true, null, difficulty);
        }


    }
}

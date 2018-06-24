module Ala3.State {
    export class Title extends Phaser.State {
        game:Ala3.Game;

        create() {
            this.add.sprite(0, 0, 'title-screen');

            let cardSize = {
                w: 109,
                h: 148
            };

            let y = 319;

            let buttons = {};

            buttons[Game.DIFFICULTY_EASY] = new Phaser.Rectangle(
                477,
                y,
                cardSize.w,
                cardSize.h
            );

            buttons[Game.DIFFICULTY_MEDIUM] = new Phaser.Rectangle(
                619,
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

            let credits = {
                dj: new Phaser.Rectangle(
                    0,
                    574,
                    171,
                    71
                ),
                jk: new Phaser.Rectangle(
                    93,
                    656,
                    158,
                    76
                ),
                al: new Phaser.Rectangle(
                    281,
                    552,
                    129,
                    84
                )
            };

            this.game.input.onDown.add(function (pointer: Phaser.Pointer) {
                for (let b in buttons) {
                    let button = buttons[b];

                    if (button.contains(pointer.x, pointer.y)) {
                        this.startGame(parseInt(b));
                        return;
                    }
                }

                for (let c in credits) {
                    let credit = credits[c];

                    if (credit.contains(pointer.x, pointer.y)) {

                        if (c === 'dj') {
                            window.open('https://twitter.com/cloakedninjas');
                        } else if (c === 'al') {
                            window.open('https://twitter.com/treslapin');
                        } else if (c === 'jk') {
                            window.open('https://twitter.com/thedorkulon');
                        }
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

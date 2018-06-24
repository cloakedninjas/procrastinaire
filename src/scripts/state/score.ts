module Ala3.State {
    export class Score extends Phaser.State {

        score: any;

        init(score) {
            this.score = score;
        }

        create() {
            this.add.sprite(0, 0, 'end-screen');

            let button = new Phaser.Rectangle(
                693,
                654,
                304,
                58
            );

            this.game.input.onDown.add(function (pointer: Phaser.Pointer) {
                if (button.contains(pointer.x, pointer.y)) {
                    this.restart();
                }
            }, this);

            let fontStyle = {
                font: '22px Arial',
                colour: '#000'
            };

            // print results

            let mult = 10;
            let total = this.score.actionsCorrect * mult;
            let bonus;

            total += this.score.cards * mult;

            if (this.score.difficulty === Game.DIFFICULTY_EASY) {
                bonus = -(total * 0.2);
                total = total + bonus;

                bonus = Math.round(bonus);
                total = Math.round(total);
            } else if (this.score.difficulty === Game.DIFFICULTY_HARD) {
                bonus = (total * 0.5);
                total = total + bonus;

                bonus = Math.round(bonus);
                total = Math.round(total);
            }


            let s:string;

            // expected
            this.add.text(471, 395, this.score.actionsDone.toString(), fontStyle);

            s = (this.score.actionsDone * mult).toString();
            this.add.text(794, 395, s, fontStyle);

            // successful
            this.add.text(471, 420, this.score.actionsCorrect.toString(), fontStyle);

            s = '-' + ((this.score.actionsDone - this.score.actionsCorrect) * mult).toString();
            this.add.text(794, 420, s, fontStyle);

            // solitaire
            s = (this.score.cards * mult).toString();
            this.add.text(795, 446, s, fontStyle);

            // bonuses
            if (this.score.difficulty === Game.DIFFICULTY_EASY) {
                this.add.text(109, 499, 'LIFE\'S A BEACH DEDUCTION', fontStyle);
                this.add.text(471, 499, '1', fontStyle);
                this.add.text(794, 499, bonus.toString(), fontStyle);
            } else if (this.score.difficulty === Game.DIFFICULTY_HARD) {
                this.add.text(109, 499, 'WORKING HALLOWEEN BONUS', fontStyle);
                this.add.text(471, 499, '1', fontStyle);
                this.add.text(794, 499, bonus.toString(), fontStyle);
            }

            // total
            fontStyle.font = '33px Arial';
            this.add.text(841, 552, total.toString(), fontStyle);


            // date

            let today = new Date();
            let dateString = today.toLocaleString('en-us', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            fontStyle.font = 'bold 22px Arial';
            this.add.text(433, 232, dateString.toUpperCase(), fontStyle);


            /*console.log('points', this.points);

            let mult = Math.round(this.accuracy * 100);

            console.log('accuracy multiplier', mult);

            let score = Math.round(this.points * this.accuracy);

            console.log('score', score);

            if (this.gameWon) {
                console.log('game won bonus (2x)', score * 2);
            }*/
        }

        restart() {
            this.state.start('title', true);
        }
    }
}

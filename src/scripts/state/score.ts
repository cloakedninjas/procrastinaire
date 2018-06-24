module Ala3.State {
    export class Score extends Phaser.State {

        points: number;
        accuracy: number;
        gameWon: boolean;

        init(points, accuracy, gameWon) {
            this.points = points;
            this.accuracy = accuracy;
            this.gameWon = gameWon;

            console.log(points, accuracy, gameWon);
        }

        create() {

            console.log('points', this.points);

            let mult = Math.round(this.accuracy * 100);

            console.log('accuracy multiplier', mult);

            let score = Math.round(this.points * this.accuracy);

            console.log('score', score);

            if (this.gameWon) {
                console.log('game won bonus (2x)', score * 2);
            }
        }


    }
}

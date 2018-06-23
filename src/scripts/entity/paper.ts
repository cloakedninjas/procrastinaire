module Ala3.Entity {
    export class Paper extends Phaser.Sprite {
        static TASK_CLIP: number = 1;
        static TASK_PEN: number = 2;
        static TASK_SHRED: number = 3;
        static TASK_STAMP: number = 4;

        static MAX_TASKS: number = 3;

        game: Game;
        startDragPos: {
            x: number,
            y: number
        };
        tasks: any;

        constructor(game) {
            super(game, 0, 0, 'paper-active');
            this.x = -(this.width / 2);
            this.y = 600;
            this.angle = 20;
            this.inputEnabled = true;
            this.startDragPos = {x: this.x, y: this.y};
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            this.tasks = [{
                task: Paper.TASK_CLIP,
                requested: false,
                done: false
            }, {
                task: Paper.TASK_PEN,
                requested: false,
                done: false
            }, {
                task: Paper.TASK_SHRED,
                requested: false,
                done: false
            }, {
                task: Paper.TASK_STAMP,
                requested: false,
                done: false
            }];

            let tasks = Math.ceil(Phaser.Math.random(1, Paper.MAX_TASKS + 1));
            let availTasks = Helpers.shuffle([
                Paper.TASK_CLIP,
                Paper.TASK_PEN,
                Paper.TASK_SHRED,
                Paper.TASK_STAMP
            ]);

            for (let i = 0; i < availTasks; i++) {
                let taskId = tasks[i];
                this.tasks[taskId].requested = true;
            }

            console.log(this.tasks);
        }


        begin() {
            // animate from left to work area
            let tween = this.game.add.tween(this).to({
                x: 475,
                y: 689,
                angle: 0
            }, 800, Phaser.Easing.Circular.Out, true);

            tween.onComplete.add(function () {
                this.input.enableDrag(false, true);
            }, this);

            this.events.onDragStart.add(function () {
                this.startDragPos = {x: this.x, y: this.y};
            }, this);

            this.events.onDragUpdate.add(function (paper, pointer: Phaser.Pointer) {
                let minScale = 0.6;
                let scale = (pointer.y / this.startDragPos.y);
                let lerp = ((1 - scale) * minScale + scale);

                this.scale.x = lerp;
                this.scale.y = lerp;
            }, this);
        }

        returnToDragStartPos() {
            this.snapTo(this.startDragPos.x, this.startDragPos.y);
        }

        snapTo(x, y) {
            this.game.add.tween(this).to({
                x: x,
                y: y,
            }, 1000, Phaser.Easing.Elastic.Out, true);

            this.game.add.tween(this.scale).to({
                x: 1,
                y: 1,
            }, 1000, Phaser.Easing.Elastic.Out, true);
        }

        shredded() {
            // check if this was meant to happen
        }

        toOutbox() {
            // done calc score
        }

        calcScore() {
            let correct = 0;

            if (!this.tasks[Paper.TASK_SHRED].requested && this.tasks[Paper.TASK_SHRED].done) {
                return -3;
            }

            for (let task of this.tasks) {
                if (task.requested && task.done) {
                    correct++;
                } else {
                    correct--;
                }
            }

            return correct;
        }
    }
}

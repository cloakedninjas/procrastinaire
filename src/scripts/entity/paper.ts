module Ala3.Entity {
    export class Paper extends Phaser.Sprite {
        static TASK_CLIP: number = 1;
        static TASK_PEN: number = 2;
        static TASK_SHRED: number = 3;
        static TASK_STAMP: number = 4;
        static TASK_STAPLER: number = 5;

        static TOTAL_TASKS: number = 5;
        static MIN_TASKS_PER_WORK: number = 1;
        static MAX_TASKS_PER_WORK: number = 6;

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

            this.tasks = {};

            this.tasks[Paper.TASK_CLIP] = {
                requested: 0,
                done: 0
            };

            this.tasks[Paper.TASK_PEN] = {
                requested: 0,
                done: 0
            };

            this.tasks[Paper.TASK_SHRED] = {
                requested: 0,
                done: 0
            };

            this.tasks[Paper.TASK_STAMP] = {
                requested: 0,
                done: 0
            };

            this.tasks[Paper.TASK_STAPLER] = {
                requested: 0,
                done: 0
            };

            let taskCount = Math.floor(Phaser.Math.random(Paper.MIN_TASKS_PER_WORK, Paper.MAX_TASKS_PER_WORK + 1));

            for (let i = 0; i < taskCount; i++) {
                let taskId = Math.floor(Phaser.Math.random(1, Paper.TOTAL_TASKS + 1));
                this.tasks[taskId].requested++;
            }

            // can't shred multiple times :D
            if (this.tasks[Paper.TASK_SHRED].requested > 1) {
                this.tasks[Paper.TASK_SHRED].requested = 1;
            }

            // add post-it
            let postit = new Phaser.Sprite(game, 10, -120, 'postit');
            postit.angle = Phaser.Math.random(-20, 20);
            this.addChild(postit);

            // add icons
            let i = 0;
            let icons = {};
            icons[Paper.TASK_CLIP] = 'icon-paperclip';
            icons[Paper.TASK_PEN] = 'icon-pen';
            icons[Paper.TASK_SHRED] = 'icon-shredder';
            icons[Paper.TASK_STAMP] = 'icon-stamp';
            icons[Paper.TASK_STAPLER] = 'icon-staple';

            for (let taskId in this.tasks) {
                let task = this.tasks[taskId];

                if (task.requested > 0) {
                    for (let j = 0; j < task.requested; j++) {
                        let x = ((i % 2) * 46) + 20;
                        let y = (Math.floor(i / 2) * 27) + 3;
                        let stamp = new Phaser.Sprite(game, x, y, icons[taskId]);
                        postit.addChild(stamp);
                        i++;
                    }
                }
            }
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

        applyTool(toolId: number) {
            let task = this.tasks[toolId];

            if (task) {
                task.done++;
            }
        }

        calcScore() {
            let correct = 0;

            if (!this.tasks[Paper.TASK_SHRED].requested && this.tasks[Paper.TASK_SHRED].done) {
                return -3;
            }

            for (let taskId in this.tasks) {
                let task = this.tasks[taskId];

                if (task.requested && task.done) {
                    correct++;
                } else if (!task.requested && task.done) {
                    correct--;
                }
            }

            return correct;
        }
    }
}

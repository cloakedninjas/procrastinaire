module Ala3.Entity {
    export class Paper extends Phaser.Sprite {
        static TOTAL_TASKS: number = 5;
        static MIN_TASKS_PER_WORK: number = 1;
        static MAX_TASKS_PER_WORK: number = 6;
        static MAX_SAME_TASK: number = 3;

        static TOOL_MARKS: {};

        game: Game;
        startDragPos: {
            x: number,
            y: number
        };
        tasks: any;
        sounds: any;

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

            this.tasks[Tool.TASK_CLIP] = {
                requested: 0,
                done: 0
            };

            this.tasks[Tool.TASK_PEN] = {
                requested: 0,
                done: 0
            };

            this.tasks[Tool.TASK_SHRED] = {
                requested: 0,
                done: 0
            };

            this.tasks[Tool.TASK_STAMP] = {
                requested: 0,
                done: 0
            };

            this.tasks[Tool.TASK_STAPLER] = {
                requested: 0,
                done: 0
            };

            let taskCount = Math.floor(Phaser.Math.random(Paper.MIN_TASKS_PER_WORK, Paper.MAX_TASKS_PER_WORK + 1));

            for (let i = 0; i < taskCount; i++) {
                let taskId = Math.floor(Phaser.Math.random(1, Paper.TOTAL_TASKS + 1));
                this.tasks[taskId].requested++;
            }

            for (let taskId in this.tasks) {
                let task = this.tasks[taskId];

                if (parseInt(taskId) === Tool.TASK_SHRED && task.requested > 1) {
                    // can't shred multiple times :D
                    task.requested = 1;
                    continue;
                }

                if (task.requested > Paper.MAX_SAME_TASK) {
                    task.requested = Paper.MAX_SAME_TASK;
                }
            }

            // add post-it
            let postit = new Phaser.Sprite(game, 10, -120, 'postit');
            postit.angle = Phaser.Math.random(-20, 20);
            this.addChild(postit);

            // add icons
            let i = 0;

            for (let taskId in this.tasks) {
                let task = this.tasks[taskId];

                if (task.requested > 0) {
                    for (let j = 0; j < task.requested; j++) {
                        let x = ((i % 2) * 46) + 20;
                        let y = (Math.floor(i / 2) * 27) + 3;
                        let stamp = new Phaser.Sprite(game, x, y, Tool.ICONS[taskId]);
                        postit.addChild(stamp);
                        i++;
                    }
                }
            }

            this.sounds = {};
            this.sounds[Tool.TASK_CLIP] = this.game.add.audio( 'paperclip');
            this.sounds[Tool.TASK_SHRED] = this.game.add.audio( 'shred');
            this.sounds[Tool.TASK_PEN] = this.game.add.audio( 'sign');
            this.sounds[Tool.TASK_STAMP] = this.game.add.audio( 'stamp');
            this.sounds[Tool.TASK_STAPLER] = this.game.add.audio( 'stapler');
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

            if (toolId !== Tool.TASK_SHRED && task.done <= Paper.MAX_SAME_TASK) {
                let x = Entity.Paper.TOOL_MARKS[toolId][task.done - 1][0];
                let y = Entity.Paper.TOOL_MARKS[toolId][task.done - 1][1];
                // add tool icon
                let mark = new Phaser.Sprite(this.game, x, y, Tool.MARKS[toolId]);
                this.addChild(mark);
            }

            this.sounds[toolId].play();
        }

        calcScore():any {
            let availPoints = 0;
            let correct = 0;

            if (!this.tasks[Tool.TASK_SHRED].requested && this.tasks[Tool.TASK_SHRED].done) {
                return -3;
            }

            for (let taskId in this.tasks) {
                let task = this.tasks[taskId];
                availPoints += task.requested;

                if (task.requested) {
                    correct += Math.min(task.done, task.requested);
                } else if (!task.requested && task.done) {
                    correct -= task.done;
                }
            }

            return {
                available: availPoints,
                correct: correct
            };
        }
    }
}

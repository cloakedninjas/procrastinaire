module Ala3.State {
    export class Game extends Phaser.State {
        static MAX_INBOX_ITEMS: number = 15;

        static MIN_DELAY_ADD_WORK_EASY: number = 9;
        static MAX_DELAY_ADD_WORK_EASY: number = 15;

        static MIN_DELAY_ADD_WORK_MEDIUM: number = 7;
        static MAX_DELAY_ADD_WORK_MEDIUM: number = 13;

        static MIN_DELAY_ADD_WORK_HARD: number = 6;
        static MAX_DELAY_ADD_WORK_HARD: number = 15;

        static DIFFICULTY_EASY: number = 1;
        static DIFFICULTY_MEDIUM: number = 2;
        static DIFFICULTY_HARD: number = 3;

        static LOSE_CONDITION_WORK: number = 1;
        static LOSE_CONDITION_TIME: number = 2;
        static WIN_CONDITION: number = 3;

        cursorTool: Phaser.Sprite;
        inboxItems: Phaser.Sprite[];
        itemInProgress: Entity.Paper;
        trayOuterInbox: Phaser.Sprite;
        outbox: Phaser.Sprite;
        shredder: Entity.Shredder;
        currentTool: Entity.Tool;
        clock: Phaser.Sprite;
        computer: Entity.Computer;

        difficulty: number;
        maxAvailScore: number = 0;
        currentScore: number = 0;
        startTime: number;
        minCounter: number = 0;
        clockTimer: Phaser.Timer;

        sounds: any;

        init(difficulty: number) {
            this.difficulty = difficulty;
        }

        create() {
            this.initStatics();

            let bg = this.add.sprite(0, 0, 'bg');
            bg.alpha = 0.6;

            this.shredder = new Entity.Shredder(this.game, 332, 146);
            this.add.existing(this.shredder);

            let stapler = new Entity.Stapler(this.game, 425, 344);
            this.add.existing(stapler);
            stapler.events.onInputDown.add(this.onToolClick, this);

            let penCup = new Entity.Pencup(this.game, 210, 254);
            this.add.existing(penCup);
            penCup.events.onInputDown.add(this.onToolClick, this);

            let paperclips = new Entity.Paperclips(this.game, 284, 393);
            this.add.existing(paperclips);
            paperclips.events.onInputDown.add(this.onToolClick, this);

            let stamp = new Entity.Stamp(this.game, 177, 434);
            this.add.existing(stamp);
            stamp.events.onInputDown.add(this.onToolClick, this);

            this.clock = this.add.sprite(397, 29, 'clock-0');

            this.computer = new Entity.Computer(this.game, 548, -7, this.difficulty);
            this.add.existing(this.computer);
            this.computer.gameComplete.addOnce(this.gameOver.bind(this, Game.WIN_CONDITION));

            let shine = new Phaser.Sprite(this.game, 921, 74, 'computer-shine');
            this.add.existing(shine);

            this.cursorTool = new Phaser.Sprite(this.game, 0, 0);
            this.cursorTool.visible = false;
            this.add.existing(this.cursorTool);

            this.trayOuterInbox = this.add.sprite(57, 424, 'tray-outer-inbox');
            this.outbox = this.add.sprite(929, 435, 'outbox');

            this.sounds = {
                paperIn: this.game.add.audio( 'paper-in'),
                paperOut: this.game.add.audio( 'paper-out'),
                pickUp: this.game.add.audio( 'pick-up'),
                putDown: this.game.add.audio( 'put-down'),
                ambient: this.game.add.audio( 'ambient', 1, true)
            };

            this.inboxItems = [];
            this.addPaperToInbox();

            window['state'] = this;

            this.game.time.events.add(3000, this.shouldAddWork, this);

            this.clockTimer = this.game.time.create();
            this.clockTimer.repeat(Phaser.Timer.MINUTE, 5, this.tickClock, this);
            this.clockTimer.start();
            this.startTime = this.game.time.now;

            this.sounds.ambient.play();
        }

        update() {
            if (this.cursorTool.visible) {
                this.cursorTool.x = this.game.input.activePointer.x;
                this.cursorTool.y = this.game.input.activePointer.y;
            }
        }

        initStatics() {
            Entity.Tool.ICONS[Entity.Tool.TASK_CLIP] = 'icon-paperclip';
            Entity.Tool.ICONS[Entity.Tool.TASK_PEN] = 'icon-pen';
            Entity.Tool.ICONS[Entity.Tool.TASK_SHRED] = 'icon-shredder';
            Entity.Tool.ICONS[Entity.Tool.TASK_STAMP] = 'icon-stamp';
            Entity.Tool.ICONS[Entity.Tool.TASK_STAPLER] = 'icon-staple';

            Entity.Tool.MARKS[Entity.Tool.TASK_CLIP] = 'paperclip';
            Entity.Tool.MARKS[Entity.Tool.TASK_PEN] = 'signature';
            Entity.Tool.MARKS[Entity.Tool.TASK_STAMP] = 'stamp';
            Entity.Tool.MARKS[Entity.Tool.TASK_STAPLER] = 'staple';

            Entity.Paper.TOOL_MARKS = {};
            Entity.Paper.TOOL_MARKS[Entity.Tool.TASK_CLIP] = [
                [-100, -178], [-63, -178], [-25, -178]
            ];

            Entity.Paper.TOOL_MARKS[Entity.Tool.TASK_PEN] = [
                [-148, 4], [14, 4], [-110, -87]
            ];

            Entity.Paper.TOOL_MARKS[Entity.Tool.TASK_STAMP] = [
                [57, 6], [0, -29], [22, -5]
            ];

            Entity.Paper.TOOL_MARKS[Entity.Tool.TASK_STAPLER] = [
                [-139, -156], [111, -158], [20, -158]
            ];
        }

        addPaperToInbox() {
            let x = -279;
            let y = 534 - (this.inboxItems.length * 30);
            let paper = new Phaser.Sprite(this.game, x, y, 'paper-inbox');
            paper.inputEnabled = true;
            paper.events.onInputDown.add(this.takeItemFromInbox, this);

            this.inboxItems.push(paper);
            this.add.existing(paper);

            this.trayOuterInbox.bringToTop();

            if (this.inboxItems.length === 5) {
                //this.computer.showPopup('You know you have some work piling up right?');
            }

            this.sounds.paperIn.play();
        }

        shouldAddWork() {
            if (this.inboxItems.length < Game.MAX_INBOX_ITEMS) {
                this.addPaperToInbox();
            }

            if (this.inboxItems.length === Game.MAX_INBOX_ITEMS) {
                this.gameOver(Game.LOSE_CONDITION_WORK);
            }

            let min;
            let max;
            switch (this.difficulty) {
                case Game.DIFFICULTY_EASY:
                    min = Game.MIN_DELAY_ADD_WORK_EASY;
                    max = Game.MAX_DELAY_ADD_WORK_EASY;
                    break;

                case Game.DIFFICULTY_MEDIUM:
                    min = Game.MIN_DELAY_ADD_WORK_MEDIUM;
                    max = Game.MAX_DELAY_ADD_WORK_MEDIUM;
                    break;

                case Game.DIFFICULTY_HARD:
                    min = Game.MIN_DELAY_ADD_WORK_HARD;
                    max = Game.MAX_DELAY_ADD_WORK_HARD;
                    break;
            }
            // queue another
            let rand = Phaser.Math.random(min, max + 1);
            this.game.time.events.add(rand * 1000, this.shouldAddWork, this);
        }

        takeItemFromInbox() {
            if (this.itemInProgress) {
                return;
            }

            let item = this.inboxItems.pop();
            item.destroy();

            this.itemInProgress = new Entity.Paper(this.game);
            this.add.existing(this.itemInProgress);
            this.itemInProgress.begin();

            this.itemInProgress.events.onDragStop.add(this.onPaperDragEnd, this);
            this.itemInProgress.events.onInputDown.add(this.clickOnPaper, this);

            window['paper'] = this.itemInProgress;

            this.sounds.paperOut.play();
        }

        checkWorkQuality() {
            let score = this.itemInProgress.calcScore();

            this.maxAvailScore += score.available;
            this.currentScore += score.correct;

            this.itemInProgress.destroy();
            this.itemInProgress = null;
        }

        onToolClick(tool: Entity.Tool) {
            if (this.currentTool && tool != this.currentTool) {
                return;
            }

            if (this.cursorTool.visible) {
                tool.alpha = 1;
                this.cursorTool.visible = false;
                this.currentTool = null;

                if (this.itemInProgress) {
                    this.itemInProgress.input.enableDrag();
                }

                this.sounds.putDown.play();
            } else {
                // picked up tool

                let icons = {};
                icons[Entity.Tool.TASK_CLIP] = 'paperclip-active';
                icons[Entity.Tool.TASK_PEN] = 'pen-active';
                icons[Entity.Tool.TASK_STAMP] = 'stamp-active';
                icons[Entity.Tool.TASK_STAPLER] = 'stapler-active';

                tool.alpha = 0.5;
                this.currentTool = tool;
                this.cursorTool.loadTexture(icons[tool.id]);
                this.cursorTool.visible = true;

                if (tool.id === Entity.Tool.TASK_PEN) {
                    this.cursorTool.anchor.y = 1;
                } else {
                    this.cursorTool.anchor.y = 0;
                }

                this.cursorTool.bringToTop();

                if (this.itemInProgress) {
                    this.itemInProgress.input.disableDrag();
                    this.itemInProgress.input.bringToTop = false; // fix for paper onDrag changing z-index
                }

                this.sounds.pickUp.play();
            }
        }

        onPaperDragEnd(paper: Entity.Paper, pointer: Phaser.Pointer) {
            if (this.shredder.getBounds().contains(pointer.x, pointer.y)) {
                this.itemInProgress.applyTool(Entity.Tool.TASK_SHRED);
                this.checkWorkQuality();
            } else if (this.outbox.getBounds().contains(pointer.x, pointer.y)) {
                this.checkWorkQuality();
                this.sounds.paperOut.play();
            } else {
                this.itemInProgress.returnToDragStartPos();
            }
        }

        clickOnPaper() {
            if (this.cursorTool.visible) {
                this.itemInProgress.applyTool(this.currentTool.id);
            }
        }

        tickClock() {
            this.minCounter++;
            this.clock.loadTexture('clock-' + this.minCounter);

            if (this.minCounter === 5) {
                this.gameOver(Game.LOSE_CONDITION_TIME);
            }
        }

        gameOver(reason: number) {
            this.game.state.start('scores', true, null, {
                actionsDone: this.maxAvailScore,
                actionsCorrect: this.currentScore,
                cards: this.computer.points,
                difficulty: this.difficulty,
                gameWon: reason === Game.WIN_CONDITION
            });
        }
    }
}

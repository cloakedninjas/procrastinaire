module Ala3.State {
    export class Game extends Phaser.State {
        static MAX_INBOX_ITEMS: number = 9;

        cursorTool: Phaser.Sprite;
        inboxItems: Phaser.Sprite[];
        itemInProgress: Entity.Paper;
        trayOuterInbox: Phaser.Sprite;
        outbox: Phaser.Sprite;
        shredder: Entity.Shredder;
        currentTool: Entity.Tool;

        create() {
            let bg = this.add.sprite(0, 0, 'bg');
            bg.alpha = 0.6;

            this.shredder = new Entity.Shredder(this.game, 335, 153);
            this.add.existing(this.shredder);
            //shredder.events.onInputDown.add(this.onToolClick, this);

            let stapler = new Entity.Stapler(this.game, 429, 348);
            this.add.existing(stapler);
            stapler.events.onInputDown.add(this.onToolClick, this);

            let penCup = new Entity.Pencup(this.game, 210, 254);
            this.add.existing(penCup);
            penCup.events.onInputDown.add(this.onToolClick, this);

            let paperclips = new Entity.Paperclips(this.game, 288, 397);
            this.add.existing(paperclips);
            paperclips.events.onInputDown.add(this.onToolClick, this);

            let stamp = new Entity.Stamp(this.game, 178, 434);
            this.add.existing(stamp);
            stamp.events.onInputDown.add(this.onToolClick, this);

            let computer = new Entity.Computer(this.game, 548, -7);
            this.add.existing(computer);

            let shine = new Phaser.Sprite(this.game, 921, 74, 'computer-shine');
            this.add.existing(shine);

            this.cursorTool = new Phaser.Sprite(this.game, 0, 0);
            this.cursorTool.visible = false;
            this.add.existing(this.cursorTool);

            this.trayOuterInbox = this.add.sprite(57, 424, 'tray-outer-inbox');
            this.outbox = this.add.sprite(896, 424, 'outbox');

            this.inboxItems = [];

            this.addPaperToInbox();

            window['state'] = this;

            this.game.time.events.add(3000, this.shouldAddWork, this);
        }

        update() {
            if (this.cursorTool.visible) {
                this.cursorTool.x = this.game.input.activePointer.x;
                this.cursorTool.y = this.game.input.activePointer.y;
            }
        }

        addPaperToInbox() {
            let x = -279;
            let y = 534 - (this.inboxItems.length * 20);
            let paper = new Phaser.Sprite(this.game, x, y, 'paper-inbox');
            paper.inputEnabled = true;
            paper.events.onInputDown.add(this.takeItemFromInbox, this);

            this.inboxItems.push(paper);
            this.add.existing(paper);

            this.trayOuterInbox.bringToTop();
        }

        shouldAddWork() {
            // add logic if work should get added
            if (this.inboxItems.length < Game.MAX_INBOX_ITEMS) {
                this.addPaperToInbox();
            }

            // queue another
            this.game.time.events.add(5000, this.shouldAddWork, this);
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
        }

        checkWorkQuality() {
            let score = this.itemInProgress.calcScore();

            console.log('score', score);

            this.itemInProgress.destroy();
            this.itemInProgress = null;
        }

        onToolClick(tool: Entity.Tool) {
            if (this.cursorTool.visible) {
                tool.alpha = 1;
                this.cursorTool.visible = false;

                if (this.itemInProgress) {
                    this.itemInProgress.input.enableDrag();
                }
            } else {
                // picked up tool

                let icons = {};
                icons[Entity.Paper.TASK_CLIP] = 'paperclip-active';
                icons[Entity.Paper.TASK_PEN] = 'pen-active';
                icons[Entity.Paper.TASK_STAMP] = 'stamp-active';
                icons[Entity.Paper.TASK_STAPLER] = 'stapler-active';

                tool.alpha = 0.5;
                this.currentTool = tool;
                this.cursorTool.loadTexture(icons[tool.id]);
                this.cursorTool.visible = true;

                if (tool.id === Entity.Paper.TASK_PEN) {
                    this.cursorTool.anchor.y = 1;
                } else {
                    this.cursorTool.anchor.y = 0;
                }

                this.cursorTool.bringToTop();

                if (this.itemInProgress) {
                    this.itemInProgress.input.disableDrag();
                    this.itemInProgress.input.bringToTop = false; // fix for paper onDrag changing z-index
                }
            }
        }

        onPaperDragEnd(paper: Entity.Paper, pointer: Phaser.Pointer) {
            if (this.shredder.getBounds().contains(pointer.x, pointer.y)) {
                this.itemInProgress.applyTool(Entity.Paper.TASK_SHRED);
                this.checkWorkQuality();
            } else if (this.outbox.getBounds().contains(pointer.x, pointer.y)) {
                this.checkWorkQuality();
            } else {
                this.itemInProgress.returnToDragStartPos();
            }
        }

        clickOnPaper() {
            if (this.cursorTool.visible) {
                this.itemInProgress.applyTool(this.currentTool.id);
            }
        }
    }
}

module Ala3.State {
    export class Game extends Phaser.State {
        static MAX_INBOX_ITEMS: number = 9;

        cursorTool: Phaser.Sprite;
        inboxItems: Phaser.Sprite[];
        itemInProgress: Entity.Paper;
        trayOuterInbox: Phaser.Sprite;
        outbox: Phaser.Sprite;
        shredder: Entity.Shredder;

        create() {
            let bg = this.add.sprite(0, 0, 'bg');
            bg.alpha = 0.6;

            this.shredder = new Entity.Shredder(this.game, 335, 153);
            this.add.existing(this.shredder);
            //shredder.events.onInputDown.add(this.onToolClick, this);

            let stapler = new Entity.Stapler(this.game, 429, 335);
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

            let solitaire = new Entity.Solitaire(this.game, 548 ,13);
            this.add.existing(solitaire);

            this.cursorTool = new Phaser.Sprite(this.game, 0, 0, 'stapler-desk');
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
                this.cursorTool.x = this.game.input.mousePointer.x;
                this.cursorTool.y = this.game.input.mousePointer.y;
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
            this.game.time.events.add(2000, this.shouldAddWork, this);
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
        }

        onToolClick(tool:Entity.Tool) {
            if (this.cursorTool.visible) {
                tool.alpha = 1;
                this.cursorTool.visible = false;

                if (this.itemInProgress) {
                    this.itemInProgress.inputEnabled = true;
                    this.itemInProgress.bringToTop();
                }
            } else {
                tool.alpha = 0.5;
                this.cursorTool.visible = true;
                this.cursorTool.bringToTop();

                if (this.itemInProgress) {
                    this.itemInProgress.inputEnabled = false;
                }
            }
        }

        onPaperDragEnd(paper: Entity.Paper, pointer: Phaser.Pointer) {
            if (this.shredder.getBounds().contains(pointer.x, pointer.y)) {
                this.itemInProgress.shredded();
                this.checkWorkQuality();
            } else if (this.outbox.getBounds().contains(pointer.x, pointer.y)) {
                this.itemInProgress.toOutbox();
                this.checkWorkQuality();
            } else {
                this.itemInProgress.returnToDragStartPos();
            }
        }

        checkWorkQuality() {
            let score = this.itemInProgress.calcScore();

            console.log('score', score);

            this.itemInProgress.destroy();
            this.itemInProgress = null;
        }
    }
}

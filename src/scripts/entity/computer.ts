module Ala3.Entity {
    export class Computer extends Phaser.Sprite {
        game: Game;
        deck: Phaser.Sprite[];

        completeStacks: Card[][];
        holdingStacks: Card[][];

        tableauPos: any;
        isOverStack: boolean = false;

        constructor(game, x, y) {
            super(game, x, y, 'computer');

            this.completeStacks = [[], [], [], []];
            this.holdingStacks = [[], [], [], [], [], [], []];
            this.deck = [];

            for (let i = 0; i < 52; i++) {
                let card = new Card(game, i);

                this.deck.push(card);
            }

            this.deck = Helpers.shuffle(this.deck);

            // build the tableau

            let cardSize = {
                w: 52,
                h: 71
            };

            this.tableauPos = {
                x: 61,
                y: 158,
                vSpacing: 18,
                stackSpacing: cardSize.w + 6,
                width: 0,
                height: 0,
                bounds: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0,
                }
            };

            this.tableauPos.width = this.holdingStacks.length * this.tableauPos.stackSpacing;
            this.tableauPos.height = cardSize.h + (this.tableauPos.vSpacing * 12);

            this.tableauPos.bounds.x1 = this.x + this.tableauPos.x;
            this.tableauPos.bounds.y1 = this.y + this.tableauPos.y;
            this.tableauPos.bounds.x2 = this.x + this.tableauPos.x + this.tableauPos.width;
            this.tableauPos.bounds.y2 = this.y + this.tableauPos.y + this.tableauPos.height;

            for (let i = 0; i < this.holdingStacks.length; i++) {
                let stack = this.holdingStacks[i];
                let card;

                for (let j = 0; j <= i; j++) {
                    card = this.deck.pop();
                    stack.push(card);

                    if (j === 0) {
                        this.addChild(card);
                        card.x = this.tableauPos.x + (i * this.tableauPos.stackSpacing);
                        card.y = this.tableauPos.y + (j * this.tableauPos.vSpacing);
                    } else {
                        let parentCard = stack[stack.length - 2];
                        card.x = 0;
                        card.y = this.tableauPos.vSpacing;
                        parentCard.addChild(card);
                    }

                    card.stackIndex = i;

                    card.events.onDragStart.add(this.onHoldingCardDragStart, this);
                    card.events.onDragUpdate.add(this.onHoldingCardDragMove, this);
                    card.events.onDragStop.add(this.onHoldingCardDragEnd, this);
                }

                card.reveal();
                card.visible = true;
            }

            window['solitaire'] = this;
        }

        onHoldingCardDragStart(card: Card, pointer: Phaser.Pointer) {
            // bring all cards to front
        }

        onHoldingCardDragMove(card: Card, pointer: Phaser.Pointer) {
            // is cursor inside tableau?

            this.isOverStack = false;

            if (pointer.x >= this.tableauPos.bounds.x1 && pointer.x <= this.tableauPos.bounds.x2 &&
                pointer.y >= this.tableauPos.bounds.y1 && pointer.y <= this.tableauPos.bounds.y2) {

                this.isOverStack = true;
            }
        }

        onHoldingCardDragEnd(card: Card, pointer) {
            if (this.isOverStack) {
                // determine which stack to snap to
                let i = Math.floor((pointer.x - this.tableauPos.bounds.x1) / this.tableauPos.stackSpacing);

                if (card.stackIndex === i) {
                    card.returnToDragStartPos();
                    return;
                }

                let stack = this.holdingStacks[i];

                // is it allowed to be dropped here?

                if (stack.length === 0 && card.value === Card.VALUE_KING) {
                    this.moveCardToStack(card, i);
                    return;
                }

                let prevCard = stack[stack.length - 1];

                if (prevCard.value === card.value + 1 && card.colour !== prevCard.colour) {
                    this.moveCardToStack(card, i);
                    return;
                }
            }

            // return it to where it started
            card.returnToDragStartPos();
        }

        moveCardToStack(card: Card, stackIndex: number) {
            let stack = this.holdingStacks[stackIndex];
            let previousStack = this.holdingStacks[card.stackIndex];
            let newParent = stack[stack.length - 1];

            /*let x = this.tableauPos.x + (stackIndex * this.tableauPos.stackSpacing);
            let y = this.tableauPos.y + (stack.length * this.tableauPos.vSpacing);*/

            previousStack.pop();
            stack.push(card);

            if (newParent) {
                // window['card'] = card;
                newParent.addChild(card);
                card.x = 0;
                card.y = this.tableauPos.vSpacing;
            }

            card.stackIndex = stackIndex;

            // reveal next card
            if (previousStack.length) {
                previousStack[previousStack.length - 1].reveal();
            }

            /*let tween = card.snapTo(x, y);
            tween.onComplete.add(function () {

            }, this);*/
        }
    }
}

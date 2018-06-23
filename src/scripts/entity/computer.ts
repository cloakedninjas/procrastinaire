module Ala3.Entity {
    export class Computer extends Phaser.Sprite {
        game: Game;
        deck: Card[];
        visibleDeck: Card[];

        completeStacks: Card[][];
        holdingStacks: Card[][];

        tableauPos: any;
        foundationPos: any;
        isOverTableau: boolean = false;
        isOverFoundation: boolean = false;

        constructor(game, x, y) {
            super(game, x, y, 'computer');

            this.completeStacks = [[], [], [], []];
            this.holdingStacks = [[], [], [], [], [], [], []];
            this.deck = [];
            this.visibleDeck = [];

            for (let i = 0; i < 52; i++) {
                let card = new Card(game, i);

                this.deck.push(card);
            }

            this.deck = Helpers.shuffle(this.deck);

            // build the tableau + foundation areas

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

            this.foundationPos = {
                x: 200,
                y: 80,
                stackSpacing: cardSize.w + 10,
                width: 0,
                height: 0,
                bounds: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0,
                }
            };

            this.foundationPos.width = this.completeStacks.length * this.foundationPos.stackSpacing;
            this.foundationPos.height = cardSize.h;

            this.foundationPos.bounds.x1 = this.x + this.foundationPos.x;
            this.foundationPos.bounds.y1 = this.y + this.foundationPos.y;
            this.foundationPos.bounds.x2 = this.x + this.foundationPos.x + this.foundationPos.width;
            this.foundationPos.bounds.y2 = this.y + this.foundationPos.y + this.foundationPos.height;

            // fill cards

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
            }

            for (let i = 0; i < this.deck.length; i++) {
                let card = this.deck[i];
                card.x = 60;
                card.y = 85;
                this.addChild(card);
            }

            this.cycleDeck();

            window['solitaire'] = this;
        }

        onHoldingCardDragStart(card: Card, pointer: Phaser.Pointer) {
            this.bringStackToTop(card);
        }

        onHoldingCardDragMove(card: Card, pointer: Phaser.Pointer) {
            // is cursor inside tableau?

            this.isOverTableau = false;
            this.isOverFoundation = false;

            if (pointer.x >= this.tableauPos.bounds.x1 && pointer.x <= this.tableauPos.bounds.x2 &&
                pointer.y >= this.tableauPos.bounds.y1 && pointer.y <= this.tableauPos.bounds.y2) {

                this.isOverTableau = true;
            } else if (
                pointer.x >= this.foundationPos.bounds.x1 && pointer.x <= this.foundationPos.bounds.x2 &&
                pointer.y >= this.foundationPos.bounds.y1 && pointer.y <= this.foundationPos.bounds.y2) {

                this.isOverFoundation = true;
            }
        }

        onHoldingCardDragEnd(card: Card, pointer) {
            if (this.isOverTableau) {
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
            } else if (this.isOverFoundation) {
                // can we drop here?
                let childCards = this.getChildCards(card);

                if (childCards.length !== 1) {
                    card.returnToDragStartPos();
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
            let childCards = this.getChildCards(card);

            /*let x = this.tableauPos.x + (stackIndex * this.tableauPos.stackSpacing);
            let y = this.tableauPos.y + (stack.length * this.tableauPos.vSpacing);*/

            for (let i = 0; i < childCards.length; i++) {
                previousStack.pop();
                stack.push(childCards[i]);
            }

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

        bringStackToTop(card: Card) {
            let parent = card.parent;
            let topChild:any = card;

            while (parent !== this) {
                topChild = parent;
                parent = parent.parent;
            }

            let i = this.children.indexOf(topChild);
            this.children.splice(i, 1);
            this.children.push(topChild);
        }

        getChildCards(card: Card) {
            let cards = [];
            let firstChild:any = card;

            cards.push(firstChild);

            while (firstChild.children.length > 0) {
                firstChild = firstChild.children[0];
                cards.push(firstChild);
            }

            return cards;
        }

        cycleDeck() {
            let card = this.deck.pop();

            card.reveal();
            card.x = 120;

            card.events.onDragUpdate.add(this.onHoldingCardDragMove, this);
            card.events.onDragStop.add(this.onHoldingCardDragEnd, this);

            this.visibleDeck.push(card);
        }
    }
}

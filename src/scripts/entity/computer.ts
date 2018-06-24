module Ala3.Entity {
    export class Computer extends Phaser.Sprite {
        game: Game;
        deck: Card[];
        visibleDeck: Card[];

        completeStacks: Card[][];
        holdingStacks: Card[][];

        deckPos: any;
        tableauPos: any;
        foundationPos: any;
        isOverTableau: boolean = false;
        isOverFoundation: boolean = false;
        moves: number = 0;
        moveLabel: Phaser.Text;

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
                x: 237,
                y: 85,
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
                        this.setCardPosInTableau(card, i, j);
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

            this.deckPos = {
                x: 60,
                y: 85,
                visibleX: 120
            };

            for (let i = 0; i < this.deck.length; i++) {
                let card = this.deck[i];
                card.x = this.deckPos.x;
                card.y = this.deckPos.y;
                this.addChild(card);
            }

            let deckBounds = new Phaser.Rectangle(
                this.x + this.deckPos.x,
                this.y + this.deckPos.y,
                cardSize.w,
                cardSize.h
            );

            game.input.onDown.add(function (pointer: Phaser.Pointer) {
                if (deckBounds.contains(pointer.x, pointer.y)) {
                    this.cycleDeck();
                }
            }, this);

            this.moveLabel = new Phaser.Text(game, 395, 390, 'Moves: 0', {
                font: '14px Arial',
                fill: '#333'
            });

            this.addChild(this.moveLabel);

            window['solitaire'] = this;
        }

        onHoldingCardDragStart(card: Card, pointer: Phaser.Pointer) {
            if (card.stackIndex === null) {
                this.bringCardToTop(card);
            } else {
                this.bringStackToTop(card);
            }
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
                if (stack.length === 0 && card.value === Card.VALUE_KING) {
                    this.moveCardToTableau(card, i);
                    return;
                }

                let newCardUnderneath = stack[stack.length - 1];
                if (newCardUnderneath) {
                    if (newCardUnderneath.value === card.value + 1 && card.colour !== newCardUnderneath.colour) {
                        this.moveCardToTableau(card, i);
                        return;
                    }
                }
            } else if (this.isOverFoundation) {
                let cardsBeingMoved = this.getChildCards(card);

                if (cardsBeingMoved.length !== 1) {
                    // can't put more than 1 card into the foundation
                    card.returnToDragStartPos();
                    return;
                }

                // determine which stack to snap to
                let i = Math.floor((pointer.x - this.foundationPos.bounds.x1) / this.foundationPos.stackSpacing);

                let stack = this.completeStacks[i];
                if (stack.length === 0 && card.value === Card.VALUE_ACE) {
                    this.moveCardToFoundation(card, i);
                    return;
                }

                let newCardUnderneath = stack[stack.length - 1];
                if (newCardUnderneath) {
                    if (newCardUnderneath.value === card.value - 1 && card.suit === newCardUnderneath.suit) {
                        this.moveCardToFoundation(card, i);
                        return;
                    }
                }
            }

            // begone and return to whence it came!
            card.returnToDragStartPos();
        }

        moveCardToTableau(card: Card, stackIndex: number) {
            let stack = this.holdingStacks[stackIndex];
            let lastCardIndex = stack.length - 1;
            let newParent = stack[lastCardIndex];
            let childCards = this.getChildCards(card);

            if (card.stackIndex === null) {
                this.removeCardFromDeck(card);
                stack.push(card);
            } else {
                let previousStack = this.holdingStacks[card.stackIndex];

                for (let i = 0; i < childCards.length; i++) {
                    previousStack.pop();
                    stack.push(childCards[i]);
                }

                // reveal next card
                if (previousStack.length) {
                    previousStack[previousStack.length - 1].reveal();
                }
            }

            if (newParent) {
                newParent.addChild(card);
                card.x = 0;
                card.y = this.tableauPos.vSpacing;
            } else {
                // detach card and give it back to us
                this.addChild(card);
                this.setCardPosInTableau(card, stackIndex, lastCardIndex);
            }

            card.stackIndex = stackIndex;
            this.incrementMoveCounter();
        }

        moveCardToFoundation(card: Card, stackIndex: number) {
            // set card parent to this or card in foundation
            let stack = this.completeStacks[stackIndex];

            if (stack.length === 0) {
                this.addChild(card);
                this.setCardPosInFoundation(card, stackIndex);
            } else {
                let newParent = stack[stack.length - 1];
                newParent.addChild(card);
                card.x = 0;
                card.y = 0;

                // maybe detach parent, and replace then kill parent?
            }

            card.removeInputControl();

            if (card.stackIndex === null) {
                // card came from deck
                this.removeCardFromDeck(card);
            } else {
                // card came from tableau
                let previousStack = this.holdingStacks[card.stackIndex];
                previousStack.pop();

                // reveal next card
                if (previousStack.length) {
                    previousStack[previousStack.length - 1].reveal();
                }
            }

            stack.push(card);
            this.incrementMoveCounter();
        }

        bringStackToTop(card: Card) {
            let parent = card.parent;
            let topChild: any = card;

            while (parent !== this) {
                topChild = parent;
                parent = parent.parent;
            }

            this.bringCardToTop(topChild);
        }

        bringCardToTop(card: Card) {
            let i = this.children.indexOf(card);
            this.children.splice(i, 1);
            this.children.push(card);
        }

        getChildCards(card: Card) {
            let cards = [];
            let firstChild: any = card;

            cards.push(firstChild);

            while (firstChild.children.length > 0) {
                firstChild = firstChild.children[0];
                cards.push(firstChild);
            }

            return cards;
        }

        cycleDeck() {
            if (this.deck.length > 0) {
                let card = this.deck.pop();

                card.reveal();
                card.x = this.deckPos.visibleX;
                this.bringCardToTop(card);

                card.events.onDragStart.add(this.onHoldingCardDragStart, this);
                card.events.onDragUpdate.add(this.onHoldingCardDragMove, this);
                card.events.onDragStop.add(this.onHoldingCardDragEnd, this);

                this.visibleDeck.push(card);
            } else {
                this.deck = this.visibleDeck;
                this.visibleDeck = [];

                this.deck.forEach(function(card: Card) {
                    card.x = this.deckPos.x;
                    card.hide();
                }, this);
            }

            this.incrementMoveCounter();
        }

        incrementMoveCounter() {
            this.moves++;
            this.moveLabel.text = 'Moves: ' + this.moves;
        }

        private setCardPosInTableau(card: Card, stackIndex: number, lastCardIndex: number) {
            lastCardIndex = Math.max(0, lastCardIndex);
            card.x = this.tableauPos.x + (stackIndex * this.tableauPos.stackSpacing);
            card.y = this.tableauPos.y + (lastCardIndex * this.tableauPos.vSpacing);
        }

        private setCardPosInFoundation(card: Card, stackIndex: number) {
            card.x = this.foundationPos.x + (stackIndex * this.foundationPos.stackSpacing);
            card.y = this.foundationPos.y;
        }

        private removeCardFromDeck(card: Card) {
            let i = this.deck.indexOf(card);
            this.deck.splice(i, 1);
        }
    }
}

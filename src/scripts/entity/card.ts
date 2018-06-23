module Ala3.Entity {
    export class Card extends Phaser.Sprite {
        static SUIT_LABEL = [
          'Hearts',
          'Diamonds',
          'Spades',
          'Clubs'
        ];

        static SUIT_ICON = ['♥', '♦', '♠', '♣'];

        game: Game;
        suit: number;
        value: number;
        colour: string;
        revealed: boolean = false;
        stackIndex: number;
        startDragPos: Phaser.Point;

        constructor(game, id:number) {
            super(game, 0, 0, 'card-back');

            this.suit = Math.floor(id / 13);
            this.value = id % 13;

            this.colour = this.suit <= 1 ? 'red' : 'black';
        }

        reveal() {
            let game = this.game;
            let width = this.width;
            let height = this.height;
            let bmd = new Phaser.BitmapData(game, 'card', width, height);

            bmd.fill(209, 211, 158);

            let borderWidth = 2;
            let borderColour = 'white';
            bmd.line(0, 0, width, 0, borderColour, borderWidth);
            bmd.line(width, 0, width, height, borderColour, borderWidth);
            bmd.line(width, height, 0, height, borderColour, borderWidth);
            bmd.line(0, height, 0, 0, borderColour, borderWidth);

            let fontStyle = '24px Arial';
            let label;

            switch (this.value) {
                case 0:
                    label = 'A';
                    break;

                case 10:
                    label = 'J';
                    break;

                case 11:
                    label = 'Q';
                    break;

                case 12:
                    label = 'K';
                    break;

                default:
                    label = this.value + 1;
            }

            label += Card.SUIT_ICON[this.suit];
            bmd.text(label, 6, 24, fontStyle, this.colour);

            this.loadTexture(bmd);

            this.revealed = true;
            this.inputEnabled = true;
            this.input.enableDrag(false, true);
            this.events.onDragStart.add(function () {
                this.startDragPos = {x: this.x, y: this.y};

                // re-order z-index

                let i = this.parent.children.indexOf(this);
                this.parent.children.slice(i, 1);
                this.parent.children.push(this);
            }, this);
        }

        returnToDragStartPos() {
            this.snapTo(this.startDragPos.x, this.startDragPos.y);
        }

        snapTo(x, y) {
            this.game.add.tween(this).to({
                x: x,
                y: y
            }, 1000, Phaser.Easing.Elastic.Out, true);
        }
    }
}

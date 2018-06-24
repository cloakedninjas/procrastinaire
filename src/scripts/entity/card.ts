module Ala3.Entity {
    export class Card extends Phaser.Sprite {
        static SUIT_LABEL = [
            'Hearts',
            'Diamonds',
            'Spades',
            'Clubs'
        ];

        static SUIT_ICON = ['♥', '♦', '♠', '♣'];
        static VALUE_KING: number = 12;
        static VALUE_ACE: number = 0;

        game: Game;
        suit: number;
        value: number;
        colour: string;
        revealed: boolean = false;
        stackIndex: number = null;
        startDragPos: Phaser.Point;

        constructor(game, id: number) {
            super(game, 0, 0, 'card-back');

            this.suit = Math.floor(id / 13);
            this.value = id % 13;

            this.colour = this.suit <= 1 ? 'red' : 'black';
        }

        reveal() {
            let game = this.game;
            let width = this.width;
            let height = this.height;
            let key = 'card-' + this.suit + '-' + this.value;
            let bmd;

            if (game.cache.checkBitmapDataKey(key)) {
                bmd = game.cache.getBitmapData(key);
            } else {
                bmd = new Phaser.BitmapData(game, key, width, height);
                bmd.draw('card-front');

                let fontStyle = '20px Arial';
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

                    case Card.VALUE_KING:
                        label = 'K';
                        break;

                    default:
                        label = this.value + 1;
                }

                label += Card.SUIT_ICON[this.suit];
                bmd.text(label, 6, 24, fontStyle, this.colour);
                game.cache.addBitmapData(key, bmd);
            }

            this.loadTexture(bmd);

            this.revealed = true;
            this.inputEnabled = true;
            this.input.enableDrag(false, false);
            this.events.onDragStart.add(function () {
                this.startDragPos = {x: this.x, y: this.y};
            }, this);
        }

        hide() {
            this.loadTexture('card-back');
        }

        returnToDragStartPos() {
            this.snapTo(this.startDragPos.x, this.startDragPos.y);
        }

        snapTo(x, y): Phaser.Tween {
            return this.game.add.tween(this).to({
                x: x,
                y: y
            }, 1000, Phaser.Easing.Elastic.Out, true);
        }

        removeInputControl() {
            this.inputEnabled = false;
            this.input.disableDrag();
        }
    }
}

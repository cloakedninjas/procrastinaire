module Ala3.Entity {
    export class Tool extends Phaser.Sprite {
        static TASK_CLIP: number = 1;
        static TASK_PEN: number = 2;
        static TASK_SHRED: number = 3;
        static TASK_STAMP: number = 4;
        static TASK_STAPLER: number = 5;

        static ICONS = {};
        static MARKS = {};

        game: Game;
        id: number;

        constructor(game, x, y, key) {
            super(game, x, y, key);

            this.inputEnabled = true;

            Tool.ICONS[Tool.TASK_CLIP] = 'icon-paperclip';
            Tool.ICONS[Tool.TASK_PEN] = 'icon-pen';
            Tool.ICONS[Tool.TASK_SHRED] = 'icon-shredder';
            Tool.ICONS[Tool.TASK_STAMP] = 'icon-stamp';
            Tool.ICONS[Tool.TASK_STAPLER] = 'icon-staple';

            Tool.MARKS[Tool.TASK_CLIP] = 'paperclip';
            Tool.MARKS[Tool.TASK_PEN] = 'signature';
            Tool.MARKS[Tool.TASK_STAMP] = 'stamp';
            Tool.MARKS[Tool.TASK_STAPLER] = 'staple';
        }
    }
}

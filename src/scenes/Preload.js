// Background
import background from "../assets/images/background.png";
// Button
import btn_orange from "../assets/images/buttons/btn_orange.png";
// UI
import ticket_base from "../assets/images/ui/ticket_base.png";
import blue_circle_base from "../assets/images/ui/blue_circle_base.png";
import ring from "../assets/images/ui/ring.png";
import selection_ring from "../assets/images/ui/selection_ring.png";
import gray_base from "../assets/images/ui/gray_base.png";
import house_symbol from "../assets/images/ui/house_symbol.png";

export default class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }
    editorPreload() {
        this.load.image('background', background);
        this.load.image('ticket_base', ticket_base);
        this.load.image('btn_orange', btn_orange);
        this.load.image('blue_circle_base', blue_circle_base);
        this.load.image('ring', ring);
        this.load.image('selection_ring', selection_ring);
        this.load.image('house_symbol', house_symbol);
        this.load.image('gray_base', gray_base);
    }
    editorCreate() {
        this.txt_progress = this.add.text(this.game.config.width / 2, this.game.config.height / 2, "0%", { fontSize: '48px' });
        this.txt_progress.setOrigin(0.5, 0.5);
    }
    preload() {

        this.editorCreate();
        this.editorPreload();

        this.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {
            this.txt_progress.setText(`${Math.round(progress * 100)}%`)
        });
        let oGameStates = {
            isNewGame: true,
            isHomeScreen: true,
        }
        this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Level", oGameStates));

    }

}
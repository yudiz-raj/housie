export default class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }
    editorPreload() {
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
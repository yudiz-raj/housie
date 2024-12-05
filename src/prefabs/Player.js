
// You can write more code here

/* START OF COMPILED CODE */

export default class Player extends Phaser.GameObjects.Container {

    constructor(scene, x, y, object) {
        super(scene, x ?? 0, y ?? 0);

        // shoe
        const shoe = scene.physics.add.sprite(object[1].x, object[1].y, object[1].texture);
        shoe.setOrigin(object[1].originX, object[1].originY);
        shoe.setSize(136, 30);
        shoe.setOffset(0, 60);
        this.add(shoe);

        // face
        const face = scene.physics.add.sprite(object[0].x, object[0].y, object[0].texture);
        face.setOrigin(0.5, 0.5);
        face.setCircle(object[0].radius, object[0].offset, object[0].offset);
        face.body.immuable = true;
        this.add(face);
    }
}
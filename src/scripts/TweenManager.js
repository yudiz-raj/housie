export default class TweenManager {
    constructor(oScene) {
        this.oScene = oScene;
    }
    moveOrScaleTo = (object, config) => {
        this.oScene.tweens.add({
            targets: object,
            x: config.x ?? object.x,
            y: config.y ?? object.y,
            scaleX: config.scaleX ?? object.scaleX,
            scaleY: config.scaleY ?? object.scaleY,
            duration: config.duration ?? 1000,
            delay: config.delay ?? 0,
            ease: config.ease ?? 'Linear',
            yoyo: config.yoyo ?? false,
            repeat: config.repeat ?? 0,
            onComplete: config?.callback
        })
    }
    alphaTo = (object, config) => {
        this.oScene.tweens.add({
            targets: object,
            alpha: config.alpha ?? object.alpha,
            duration: config.duration ?? 1000,
            delay: config.delay ?? 0,
            ease: config.ease ?? 'Linear',
            yoyo: config.yoyo ?? false,
            repeat: config.repeat ?? 0,
            onComplete: config?.callback
        })
    }
    rotateTo = (object, config) => {
        this.oScene.tweens.add({
            targets: object,
            angle: config.angle,
            duration: config.duration ?? 1000,
            delay: config.delay ?? 0,
            ease: config.ease ?? 'Linear',
            yoyo: config.yoyo ?? false,
            repeat: config.repeat ?? 0,
            onComplete: config?.callback
        })
    }
}
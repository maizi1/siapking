const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    timer: cc.Node;
    siapCount: number = 37;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.handlerTimer(this.timer);
    }

    start() {}

    update(dt: number) {}

    handlerTimer(timerNode: cc.Node) {
        const [ssNode, mmNode] = timerNode.children;
        cc.tween(timerNode)
            .to(0.3, { position: cc.v2(-140, 210), rotation: 5 }, { easing: 'sineIn'})
            .start();
    }
}

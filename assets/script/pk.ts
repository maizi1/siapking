// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import pkMatch from './pkMatch';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Pk extends cc.Component {
    @property(cc.Node)
    match: cc.Node = null;
    @property(cc.Node)
    startNode: cc.Node = null;
    @property(cc.Node)
    out: cc.Node;

    @property(cc.AudioClip)
    readyAudio: cc.AudioClip = null;
    @property(cc.AudioClip)
    whistleAudio: cc.AudioClip = null;
    @property(cc.AudioClip)
    outAudio: cc.AudioClip = null;

    isReady: boolean = false;

    onLoad() {
        // pkMatch(this.match, () => {
        //     this.scheduleOnce(() => this.match.destroy(), 1);
        // });
        this.playStart();
    }

    start() {}

    playStart() {
        const [ready, go] = this.startNode.children;
        const { tween } = cc;
        tween(this.startNode)
            .to(0.6, { position: cc.v2(0, -35) })
            .delay(1)
            .to(0.6, { position: cc.v2(-670, -35) })
            .start();
        tween(ready)
            .delay(0.8)
            .to(0.2, { opacity: 0 })
            .start();
        tween(go)
            .delay(0.9)
            .to(0.3, { opacity: 255 })
            .start();

        this.scheduleOnce(() => {
            cc.audioEngine.playEffect(this.readyAudio, false);
            this.isReady = true;
        }, 1.2);
    }

    onOut() {
        const { out } = this;
        const { children } = out;
        cc.tween(out)
            .to(0.6, { position: cc.v2(-550, -284) }, { easing: 'sineInOut' })
            .start();
        cc.tween(children[1])
            .delay(1.2)
            .by(0.4, { position: cc.v2(-380, 0) }, { easing: 'sineInOut' })
            .start();
        cc.tween(children[2])
            .delay(1.2)
            .by(0.4, { position: cc.v2(-380, 0) }, { easing: 'sineInOut' })
            .start();
        cc.tween(children[0])
            .delay(1.6)
            .by(0.4, { position: cc.v2(-380, 0) }, { easing: 'sineInOut' })
            .start();
        cc.audioEngine.playEffect(this.whistleAudio, false);
        this.scheduleOnce(() => {
            cc.audioEngine.playEffect(this.outAudio, false);
        }, 0.8);
    }

    // update (dt) {}
}

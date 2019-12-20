// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    card: cc.Prefab;
    @property(cc.Node)
    cardBox: cc.Node;

    height: number = 180;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        const scores = JSON.parse(cc.sys.localStorage.getItem('scores'));
        if (scores) {
            scores.forEach(({ when, day, scors }) => {
                const card = cc.instantiate(this.card);
                const { children } = card;
                children[0].getComponent(cc.Label).string = `用时: ${when[0]}.${Math.round(
                    when[1]
                )}秒`;
                children[1].getComponent(cc.Label).string = day;
                children[2].getComponent(cc.Label).string = scors ? scors : 'F';
                this.cardBox.addChild(card);
                card.setPosition(cc.v2(0, this.height));
                this.height -= 85;
            });
        }
    }

    start() {}
    gotoHome() {
        cc.director.loadScene('home');
    }

    // update (dt) {}
}

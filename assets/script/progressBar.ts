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
    @property(cc.Node)
    wait: cc.Node = null;
    @property(cc.ProgressBar)
    progressBarView: cc.ProgressBar = null;

    speed: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.Global.gotoRoad = this.gotoRoad;
        this.wait.active = false;
        this.node.active = false
        this.progressBarView.progress = 0;
    }

    start() {
        // this.gotoRoad()
    }

    gotoRoad = (screenName: string) => {
        this.wait.active = true;
        this.node.active = true;

        cc.director.preloadScene(
            screenName,
            (completedCount, totalCount, item) => {
                this.speed = completedCount / totalCount;
            },
            (err, asset) => {
                this.wait.active = false;
                this.node.active = false;
                this.speed = 0;
                cc.director.loadScene(screenName);
            }
        );
    };

    update() {
        this._updateProgressBar(this.progressBarView);
    }
    _updateProgressBar(progressBar: cc.ProgressBar) {
        progressBar.progress = this.speed;
    }
}

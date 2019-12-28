
const { ccclass, property } = cc._decorator;
@ccclass
export default class Home extends cc.Component {
    @property(cc.Node)
    gif: cc.Node;
    @property(cc.Label)
    score: cc.Label;

    @property(cc.AudioClip)
    clickAudio: cc.AudioClip;
    @property(cc.AudioClip)
    bgAudio: cc.AudioClip;

    languagePointer: number = 0;

    onLoad() {
        this.score.string = cc.sys.localStorage.getItem('score') || 'F';
        this.handlerGif(this.gif.children);
        cc.audioEngine.playEffect(this.bgAudio, true);
    }


    handlerGif(nodes: Array<cc.Node>) {
        const callFunc = flipXToggle(nodes);
        nodes[1].active = false;

        this.schedule(callFunc, 0.33);

        function flipXToggle(targetNodes: Array<cc.Node>) {
            let isRight = false;
            return () => {
                targetNodes[isRight ? 0 : 1].active = true;
                targetNodes[isRight ? 1 : 0].active = false;
                isRight = !isRight;
            };
        }
    }

    startGame() {
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.loadScene('solo');
    }

    goToStandings() {
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.loadScene('standings');
    }

    goToVersus() {
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.loadScene('pk');
    }
}

const i18n = require('LanguageData');
const { ccclass, property } = cc._decorator;
@ccclass
export default class Helloworld extends cc.Component {
    @property(cc.Node)
    gif: cc.Node;
    @property(cc.Label)
    i18nLabel: cc.Label;
    @property(cc.Label)
    score: cc.Label;

    @property(cc.AudioClip)
    clickAudio: cc.AudioClip;
    @property(cc.AudioClip)
    bgAudio: cc.AudioClip;

    languagePointer: number = 0;

    onLoad() {
        i18n.init('zh');
        this.score.string = cc.sys.localStorage.getItem('score') || 'F';
        this.handlerGif(this.gif.children);
        cc.audioEngine.playEffect(this.bgAudio, true);
    }

    togglI18n(event: cc.Event) {
        const languages = ['zh', 'en'];
        cc.audioEngine.playEffect(this.clickAudio, false);
        if (this.languagePointer + 1 === languages.length) {
            this.languagePointer = 0;
        } else {
            this.languagePointer++;
        }
        i18n.init(languages[this.languagePointer]);
        i18n.updateSceneRenderers();
        this.i18nLabel.string = languages[this.languagePointer];
    }

    handlerGif(nodes: Array<cc.Node>) {
        const callFunc = flipXToggle(nodes);
        nodes[0].active = false;
        nodes[1].active = false;

        this.schedule(callFunc, 0.33);

        function flipXToggle(targetNodes: Array<cc.Node>) {
            let isRight = true;
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
        cc.director.loadScene('versus');
    }
}

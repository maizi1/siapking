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
    languagePointer: number = 0;

    onLoad() {
        i18n.init('zh');
        this.score.string = cc.sys.localStorage.getItem('score') || ''; 
        this.handlerGif(this.gif.children);
    }

    togglI18n(event: cc.Event) {
        const languages = ['zh', 'en'];
        if (this.languagePointer + 1 === languages.length) {
            this.languagePointer = 0;
        } else {
            this.languagePointer++
        }
        i18n.init(languages[this.languagePointer]);
        i18n.updateSceneRenderers()
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
        cc.director.loadScene('solo');
    }
}

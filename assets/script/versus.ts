const { ccclass, property } = cc._decorator;

@ccclass
export default class Versus extends cc.Component {
    @property(cc.Label)
    timer: cc.Label = null; // 30秒倒计时标签
    @property(cc.Label)
    slapNumLabel: cc.Label;

    @property(cc.Node)
    out: cc.Node;
    @property(cc.Node)
    startModal: cc.Node;
    @property(cc.Node)
    readyNode: cc.Node;
    @property(cc.Node)
    goNode: cc.Node;
    @property(cc.Node)
    slapNode: cc.Node;
    @property(cc.Node)
    userLeftNode: cc.Node;
    @property(cc.Node)
    userRightNode: cc.Node;
    @property(cc.Node)
    userLeftScore: cc.Node;
    @property(cc.Node)
    userRightScore: cc.Node;
    @property(cc.Node)
    score: cc.Node;
    @property(cc.Node)
    result: cc.Node;
    @property(cc.Node)
    loadingNode: cc.Node;
    @property(cc.Node)
    loadUser1: cc.Node;
    @property(cc.Node)
    loadUser2: cc.Node;

    @property(cc.AudioClip)
    screamAudio: cc.AudioClip;
    @property(cc.AudioClip)
    readyGoAudio: cc.AudioClip;
    @property(cc.AudioClip)
    slapAudio: cc.AudioClip;
    @property(cc.AudioClip)
    whistleAudio: cc.AudioClip;
    @property(cc.AudioClip)
    outAudio: cc.AudioClip;
    loaddingStatus = {
        status: 0,
        set(node: cc.Node, _this: Versus) {
            this.status++;
            if (this.status === 2) {
                _this.scheduleOnce(() => {
                    node.active = false;
                }, 0.6);
                _this.scheduleOnce(_this.init, 0.6);
            }
        },
    };

    isStart: boolean = false;
    isOut: boolean = false;
    time: number = 30; // 秒
    slapNum: number = 0;
    maxSlapNum: number = 37;
    allScore = {
        a: {},
        b: {},
        c: {},
    };
    gameStatus: number = 0;

    handlerUserLeftSlap: (dt: number) => void;
    handlerUserRightSlap: (dt: number) => void;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.loading(this.loadUser1.children, 'summer', Math.random() < 0.5 ? 1.5 : -1.5);
        this.loading(this.loadUser2.children, 'windLive', 0);
    }

    init() {
        cc.tween(this.slapNumLabel.node)
            .to(0.5, { position: cc.v2(-7, -150) }, { easing: 'sineIn' })
            .start();
        cc.tween(this.startModal)
            .to(0.2, { position: cc.v2(0, 0) })
            .delay(0.5)
            .to(0.4, { rotation: 360, scale: 0 })
            .start();
        this.scheduleOnce(() => cc.audioEngine.playEffect(this.screamAudio, false), 0.2);

        cc.tween(this.readyNode)
            .delay(1.1)
            .to(0.4, { position: cc.v2(0, -3) })
            .delay(0.3)
            .by(0.4, { position: cc.v2(-360) })
            .start();
        cc.tween(this.goNode)
            .delay(2.2)
            .to(0.4, { position: cc.v2(0, -3) })
            .delay(0.3)
            .by(0.4, { position: cc.v2(-360) })
            .start();

        this.scheduleOnce(() => cc.audioEngine.playEffect(this.readyGoAudio, false), 1.2);
        this.schedule(
            () => {
                this.isStart = true;
                this.timer.string = '' + --this.time;
            },
            1,
            29,
            3.3
        );

        this.handlerUserLeftSlap = this.LRuserSlap(this.userLeftNode.children, 'a', 'summer');
        this.handlerUserRightSlap = this.LRuserSlap(this.userRightNode.children, 'b', 'windLive');
    }

    update(dt: number) {
        if (this.slapNum > 8 && this.slapNumLabel.node.opacity > 0 && !this.isOut) {
            this.slapNumLabel.node.opacity -= 40;
        }
        if (this.isStart) {
            this.handlerUserLeftSlap(dt);
            this.handlerUserRightSlap(dt);
        }

        if (this.slapNum > this.maxSlapNum && !this.isOut) {
            this.onOut();
        }
        if (!this.time || this.gameStatus === 3) {
            this.isStart = false;
            this.time = 1;

            if (!this.isOut) {
                this.allScore.c = {
                    when: 30 - this.time,
                    score: this.slapNum !== 37 ? 'out' : this.getScore(30 - this.time),
                    name: '本机',
                };
            }
            this.gameStatus++;
            let resultArr = [];
            for (let key in this.allScore) {
                resultArr.push(this.allScore[key]);
            }
            resultArr.sort((a, b) => a.when - b.when);
            resultArr.forEach((obj, index) => {
                const nodes = this.result.children[index].children;
                nodes[0].getComponent(cc.Label).string = obj.name;
                nodes[1].getComponent(cc.Label).string = '用时' + obj.when;
                nodes[2].getComponent(cc.Label).string = obj.score;
            });
            cc.tween(this.result)
                .to(0.3, { position: cc.v2(0, 0), scale: 1 })
                .start();
        }
    }
    start() {}

    onOut() {
        const { out } = this;
        const { children } = out;
        this.isOut = true;
        this.score.getComponent(cc.Label).string = this.slapNum + '次 out';
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
        cc.tween(this.score)
            .delay(1.6)
            .to(0.4, { scale: 1 }, { easing: 'sineInOut' })
            .start();
        cc.audioEngine.playEffect(this.whistleAudio, false);
        this.scheduleOnce(() => {
            cc.audioEngine.playEffect(this.outAudio, false);
        }, 0.8);
        this.allScore.c = {
            when: 30 - this.time,
            score: 'out',
            name: '本机',
        };
        this.gameStatus++;
    }

    onDone() {
        if (this.isOut) {
            return;
        }
        if (this.slapNum === this.maxSlapNum) {
            this.isOut = true;
            this.score.getComponent(cc.Label).string = this.slapNum + '次 out';
            cc.tween(this.score)
                .to(0.4, { scale: 1 }, { easing: 'sineInOut' })
                .start();
            this.allScore.c = {
                when: 30 - this.time,
                score: this.getScore(30 - this.time),
                name: '本机',
            };
            this.slapNumLabel.node.opacity = 255;
            this.gameStatus++;
        } else {
            // 失败
            this.onOut();
            this.slapNumLabel.node.opacity = 255;
            // this.onScore();
        }
    }

    onslap() {
        if (!this.isStart || this.isOut) {
            return;
        }
        const [slapLeft, slapRight, front] = this.slapNode.children;

        if (!this.slapNum) {
            front.active = false;
        }

        cc.audioEngine.playEffect(this.slapAudio, false);
        if (this.slapNum++ % 2 === 0) {
            slapLeft.active = true;
            slapRight.active = false;
        } else {
            slapLeft.active = false;
            slapRight.active = true;
        }
        this.slapNumLabel.string = '' + this.slapNum;
    }

    LRuserSlap(nodes: cc.Node[], key: string, name: string = '') {
        const [
            countNode,
            {
                children: [slapLeft, slapRight, front, score],
            },
            roundBox,
            nameNode,
        ] = nodes;
        const { maxSlapNum } = this;
        const countLabel = countNode.getComponent(cc.Label);
        const random = Math.floor(Math.random() * 100);
        let count = 0;
        let time = 0;
        let when = 0;
        let end = false;
        nameNode.getComponent(cc.Label).string = name;
        switch (true) {
            case random < 3:
                when = Math.random() * 4 + 2;
                break;
            case random < 10:
                when = Math.random() + 6;
                break;
            case random < 20:
                when = Math.random() + 7;
                break;
            case random < 35:
                when = Math.random() + 8;
                break;
            case random < 60:
                when = Math.random() + 9;
                break;
            case random < 100:
                when = Math.random() * 20 + 10;
                break;
        }

        const gap = when / 37;
        return (dt: number) => {
            time += dt;
            if (time >= gap && !end) {
                time = 0;

                if (!count) {
                    front.active = false;
                }

                count++;
                countLabel.string = '' + count;

                if (count % 2 === 0) {
                    slapLeft.active = true;
                    slapRight.active = false;
                } else {
                    slapLeft.active = false;
                    slapRight.active = true;
                }

                if (count === maxSlapNum) {
                    const random = Math.random();

                    if (random < 0.5) {
                        end = true;
                        score.active = true;
                        const scoreString = this.getScore(when);
                        score.getComponent(cc.Label).string = scoreString;

                        this.scheduleOnce(() => {
                            slapRight.active = false;
                            slapLeft.active = false;
                        }, 0.7);
                        this.allScore[key] = {
                            when: Math.round(when),
                            score: scoreString,
                            name: name,
                        };
                    } else {
                        count++;
                        end = true;
                        score.active = true;
                        countLabel.string = '' + count;
                        score.getComponent(cc.Label).string = 'out';
                        this.allScore[key] = {
                            when: Math.round(when),
                            score: 'out',
                            name: name,
                        };
                    }
                    cc.tween(score)
                        .by(0.4, { position: cc.v2(0, -100), scale: 1.2 })
                        .to(0.1, { scale: 1 })
                        .start();
                    this.gameStatus++;
                }
            }
        };
    }

    getScore = (when: number) => {
        const scoreRuler = [10, 9, 8, 7, 6, 0];
        const scoreStrings = ['E', 'D', 'C', 'B', 'A', 'S'];

        for (let i = 0, len = scoreRuler.length; i < len; i++) {
            if (when >= scoreRuler[i]) {
                return scoreStrings[i];
            }
        }
    };

    loading(nodes: cc.Node[], str: string, diff: number) {
        const [loading, name, icon] = nodes;
        const rotateL = cc.rotateBy(1, 360).easing(cc.easeIn(1));
        // const rotateR = cc.rotateBy(0.15, 360);

        const loadRotate = cc.repeatForever(rotateL);
        loading.runAction(loadRotate);
        this.scheduleOnce(() => {
            loading.stopAction(loadRotate);
            name.getComponent(cc.Label).string = str;
            cc.tween(icon)
                .to(0.3, { scale: 1 })
                .start();
            this.loaddingStatus.set(this.loadingNode, this);
        }, 2.5 + diff);
    }

    goToHome() {
        cc.director.loadScene('home');
    }

    onReset() {
        cc.director.loadScene('versus');
    }
}

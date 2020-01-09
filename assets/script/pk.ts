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
    @property(cc.Node)
    slapNode: cc.Node;
    @property(cc.Node)
    score: cc.Node;
    @property(cc.Node)
    head: cc.Node;
    @property(cc.Node)
    result: cc.Node;
    @property(cc.Node)
    succeed: cc.Node;

    @property(cc.Label)
    timer: cc.Label = null;
    @property(cc.Label)
    slapNumLabel: cc.Label;

    @property(cc.AudioClip)
    readyAudio: cc.AudioClip = null;
    @property(cc.AudioClip)
    whistleAudio: cc.AudioClip = null;
    @property(cc.AudioClip)
    outAudio: cc.AudioClip = null;
    @property(cc.AudioClip)
    slapAudio: cc.AudioClip;
    @property(cc.AudioClip)
    clickAudio: cc.AudioClip;

    @property(cc.SpriteFrame)
    starhi: cc.SpriteFrame;

    isReady: boolean = false;
    isStart: boolean = false;
    isOut: boolean = false;
    isSucceed: boolean = false;

    time: number = 30;
    initTime: number = 30;
    slapNum: number = 0;
    maxSlapNum: number = 37;
    gameStatus: number = 0;

    timerCallback: () => void;

    allScore = {
        a: {},
        b: {},
        c: {},
    };

    handlerUserLeftSlap: (dt: number) => void;
    handlerUserRightSlap: (dt: number) => void;

    onLoad() {
        pkMatch(this.match, () => {
            this.scheduleOnce(() => {
                this.match.destroy();
                this.playStart();
            }, 1);
        });
    }

    start() {}

    async update(dt: number) {
        // if (this.slapNum > 8 && this.slapNumLabel.node.opacity > 0 && !this.isOut) {
        //     this.slapNumLabel.node.opacity -= 40;
        // }
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

            this.unschedule(this.timerCallback);
            if (this.slapNum !== 37 && !this.isSucceed) {
                this.onOut();
                await new Promise(resolve => {
                    setTimeout(resolve, 2400);
                });
            } else if (!this.isSucceed) {
                this.onSucceed();
                await new Promise(resolve => {
                    setTimeout(resolve, 4000);
                });
            }
            this.succeed.active = false;
            this.gameStatus++;
            let resultArr = [];
            for (let key in this.allScore) {
                resultArr.push(this.allScore[key]);
            }
            resultArr.sort((a, b) => a.succeed - b.succeed);
            resultArr.sort((a, b) => a.when - b.when);
            console.log(resultArr);
            resultArr.forEach((obj, index) => {
                const nodes = this.result.children[index].children;
                nodes[1].getComponent(cc.Label).string = obj.name;
                nodes[2].getComponent(cc.Label).string =
                    (obj.when ? obj.when : this.initTime - this.time) + '秒';
            });
            cc.tween(this.result)
                .to(0.3, { position: cc.v2(0, 0), scale: 1 })
                .start();
        }
    }

    onSucceed() {
        this.isOut = true;
        this.isSucceed = true;
        const ss = this.initTime - this.time;
        const [skeletonNode, starNode] = this.succeed.children;
        const skeleton = skeletonNode.getComponent(sp.Skeleton);
        // const track = skeleton.addAnimation(0, 'animation', false, 0.6);
        let path = '';
        let starNum = 0;
        if (ss < 10) {
            path = 'huanguan';
            starNum = Math.ceil(10 - ss);
        } else if (ss < 15) {
            path = 'jinpai';
            starNum = Math.ceil(15 - ss);
        } else if (ss < 25) {
            path = 'yinpai';
            starNum = Math.ceil((25 - ss) / 2);
        }

        const [bg, ...stars] = starNode.children;
        skeleton.setStartListener(() => {
            cc.loader.loadRes(
                'image/succeed/' + (path || 'yinpai'),
                cc.SpriteFrame,
                (err, spr: cc.SpriteFrame) => {
                    console.log(err);
                    bg.getComponent(cc.Sprite).spriteFrame = spr;
                    starNum = starNum > 5 ? 5 : starNum;
                    for (let i = 0; i < starNum; i++) {
                        stars[i].getComponent(cc.Sprite).spriteFrame = this.starhi;
                    }
                    cc.tween(starNode)
                        .to(0.4, { position: cc.v2(0, 0) })
                        .to(0.2, { rotation: 0 })
                        .start();
                    this.allScore.c = {
                        when: this.initTime - this.time,
                        succeed: 1,
                        name: '孙悟空',
                    };
                    this.gameStatus++;
                }
            );
        });
        this.succeed.active = true;
    }

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
            const { children } = this.head;
            cc.audioEngine.playEffect(this.readyAudio, false);
            this.isReady = true;
            this.handlerUserLeftSlap = this.LRuserSlap(children[1].children, 'a', '猪八戒');
            this.handlerUserRightSlap = this.LRuserSlap(children[2].children, 'b', '沙和尚');
        }, 1.2);

        this.timerCallback = () => {
            this.isStart = true;
            this.timer.string = '' + --this.time;
        };
        this.schedule(this.timerCallback, 1, this.time - 1, 1.5);
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

    onOut() {
        const { out } = this;
        const { children } = out;
        this.isOut = true;
        cc.tween(out)
            .to(0.6, { position: cc.v2(-1122, -595) }, { easing: 'sineInOut' })
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
            when: this.initTime - this.time,
            succeed: 0,
            name: 's孙悟空',
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
            this.onSucceed();
            this.allScore.c = {
                when: this.initTime - this.time,
                name: '孙悟空',
                succeed: true,
            };
            this.slapNumLabel.node.opacity = 255;
        } else {
            // 失败
            this.onOut();
            this.slapNumLabel.node.opacity = 255;
        }
    }

    LRuserSlap(nodes: cc.Node[], key: string, name: string = '') {
        const [_, icon, nameNode, countNode] = nodes;
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

        this.allScore[key].name = name;

        const gap = when / 37;
        return (dt: number) => {
            time += dt;
            if (time >= gap && !end) {
                time = 0;

                count++;
                countLabel.string = '' + count;

                if (count === maxSlapNum) {
                    const random = Math.random();

                    if (random < 0.5) {
                        end = true;
                        this.allScore[key] = {
                            when: Math.round(when),
                            name: name,
                            succeed: 1,
                        };
                    } else {
                        count++;
                        end = true;
                        countLabel.string = '' + count;
                        this.allScore[key] = {
                            when: Math.round(when),
                            name: name,
                            succeed: 0,
                        };
                    }
                    this.gameStatus++;
                }
            }
        };
    }

    onReset() {
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.loadScene('pk');
    }

    goToHome() {
        cc.director.resume();
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.loadScene('home');
    }
}

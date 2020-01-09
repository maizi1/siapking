const { ccclass, property } = cc._decorator;

@ccclass
export default class Solo extends cc.Component {
    @property(cc.Node)
    timer: cc.Node;
    @property(cc.Node)
    hint: cc.Node;
    @property(cc.Node)
    out: cc.Node;
    @property(cc.Node)
    slap: cc.Node;
    @property(cc.Node)
    slapNumNode: cc.Node;
    @property(cc.Label)
    slapNumLabel: cc.Label;
    @property(cc.Node)
    pauseNode: cc.Node;
    @property(cc.Node)
    startNode: cc.Node;
    @property(cc.Node)
    scoreNode: cc.Node;
    @property(cc.Node)
    direction: cc.Node;
    @property(cc.Node)
    succeed: cc.Node;

    @property(cc.AudioClip)
    readyAudio: cc.AudioClip;
    @property(cc.AudioClip)
    slapAudio: cc.AudioClip;
    @property(cc.AudioClip)
    whistleAudio: cc.AudioClip;
    @property(cc.AudioClip)
    outAudio: cc.AudioClip;
    @property(cc.AudioClip)
    clickAudio: cc.AudioClip;
    @property(cc.AudioClip)
    scoreAudio1: cc.AudioClip;
    @property(cc.AudioClip)
    scoreAudio2: cc.AudioClip;
    @property(cc.AudioClip)
    scoreGrade01: cc.AudioClip;
    @property(cc.AudioClip)
    scoreGrade02: cc.AudioClip;
    @property(cc.AudioClip)
    scoreGrade03: cc.AudioClip;
    @property(cc.AudioClip)
    scoreGrade04: cc.AudioClip;
    @property(cc.AudioClip)
    scoreGrade05: cc.AudioClip;
    @property(cc.AudioClip)
    scoreGrade06: cc.AudioClip;

    @property(cc.SpriteFrame)
    starhi: cc.SpriteFrame;

    score: string = '';
    maxSlapNum: number = 37;
    slapNum: number = 0;
    isStart: boolean = false;
    isOut: boolean = false;
    isPause: boolean = false;
    onTimer: (dt: number) => number[];

    isReady: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {}

    start() {}

    playStart() {
        const [ready, go] = this.startNode.children;
        const { tween } = cc;
        cc.tween(this.slapNumNode)
            .to(0.5, { position: cc.v2(-0, -330) }, { easing: 'sineIn' })
            .start();
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

    update(dt: number) {
        if (this.isStart) {
            this.onTimer(dt);
        }
        if (this.slapNum > 8 && this.slapNumNode.opacity > 0 && !this.isOut) {
            this.slapNumNode.opacity -= 40;
        }
        if (this.slapNum > this.maxSlapNum && !this.isOut) {
            this.onOut();
        }
    }

    writeScore() {
        const { localStorage } = cc.sys;
        let logs = localStorage.getItem('scores');
        logs = logs ? JSON.parse(logs) : [];
        let when = this.onTimer(0)
        for (let i = 0; i < logs.length; i++) {
            if (when > logs[i].when) {
                return
            }
        }
        const date = new Date();
        let fmt = 'yyyy-MM-dd hh:mm';
        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }
        const scorsObj = {
            day: fmt,
            when: this.onTimer(0),
            scors: this.score,
        };

        logs.push(scorsObj);
        localStorage.setItem('scores', JSON.stringify(logs));
        localStorage.setItem('score', this.score);
    }

    goToHome() {
        cc.director.resume();
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.loadScene('home');
    }

    onslap() {
        if (this.isPause || this.isOut) {
            return;
        }
        const [slapLeft, slapRight, front] = this.slap.children;
        if (!this.isStart) {
            cc.tween(this.timer)
                .to(0.2, { position: cc.v2(-250, 480) }, { easing: 'sineIn' })
                .start();
            this.isStart = true;
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

    onDone() {
        if (this.isOut) {
            return;
        }
        if (this.slapNum === this.maxSlapNum) {
            this.isStart = false;
            this.isOut = true;
            this.onSucceed();
            this.writeScore();
        } else {
            // 失败
            this.onOut();
            // this.onSucceed();
        }
    }

    onSucceed() {
        this.isStart = false;
        this.isOut = true;
        const ss = this.onTimer(0)[0];
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
                    this.scheduleOnce(() => cc.director.loadScene('succeed'), 2.2)
                    
                }
            );
        });
        this.succeed.active = true;
    }

    onScore() {
        const { tween } = cc;
        const ss = this.onTimer(0)[0];

        const [
            ,
            { children: modal1s },
            { children: modal2s },
            {
                children: [rulerBox, ruler],
            },
            { children: sae },
        ] = this.scoreNode.children;
        const scoreRuler = [10, 9, 8, 7, 6, 0];
        const scoreStrings = ['E', 'D', 'C', 'B', 'A', 'S'];
        let leftShift: number;

        tween(this.scoreNode)
            .to(0.4, { position: cc.v2(0, 74) }, { easing: 'sineInOut' })
            .by(0.6, { position: cc.v2(35, 10) }, { easing: 'sineOut' })
            .start();
        this.scheduleOnce(() => {
            cc.audioEngine.playEffect(this.scoreAudio1, false);
        }, 0.2);
        for (let i = 0, len = scoreRuler.length; i < len; i++) {
            if (ss >= scoreRuler[i]) {
                leftShift = i;
                break;
            }
        }

        for (let i = 0; i <= leftShift; i++) {
            if (i) {
                tween(ruler)
                    .delay(0.3 * i)
                    .by(0.3, { position: cc.v2(-50, 0) })
                    .start();
                tween(rulerBox)
                    .delay(0.3 * i + 0.4)
                    .by(0, { position: cc.v2(-50, 0) })
                    .start();
                this.scheduleOnce(() => {
                    cc.audioEngine.playEffect(this['scoreGrade0' + i], false);
                }, 0.3 * i + 0.4);
            } else {
                rulerBox.active = true;
                cc.audioEngine.playEffect(this.scoreGrade01, false);
            }

            tween(modal1s[i])
                .delay(0.3 * i + 0.5)
                .to(0.3, { opacity: 0 })
                .start();
            tween(modal2s[i])
                .delay(0.3 * i + 0.5)
                .to(0.3, { opacity: 210 })
                .start();
        }
        sae[leftShift].active = true;
        tween(sae[leftShift])
            .delay(0.3 * leftShift + 0.3)
            .to(0.3, { scale: 1 })
            .start();
        this.score = scoreStrings[leftShift];
        this.slapNumLabel.node.opacity = 255;
    }

    onOut() {
        const { out } = this;
        const { children } = out;
        this.isStart = false;
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
        cc.audioEngine.playEffect(this.whistleAudio, false);
        this.scheduleOnce(() => {
            cc.audioEngine.playEffect(this.outAudio, false);
        }, 0.8);
        this.slapNumLabel.node.opacity = 255;
        this.scheduleOnce(() => cc.director.loadScene('fail'), 2.5)
    }

    onReset() {
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.resume();
        cc.director.loadScene('solo');
    }

    onPause() {
        cc.audioEngine.playEffect(this.clickAudio, false);
        if (this.isPause) {
            cc.director.resume();
            cc.tween(this.pauseNode).to(0.2, {position: cc.v2(900,0)}).start();
            this.scheduleOnce(() => this.pauseNode.active = false, 0.23);
            this.isPause = false;
            return;
        }
        this.pauseNode.active = true;
        cc.tween(this.pauseNode).to(0.2, {position: cc.v2(0,0)}).start();
        this.isPause = true;
        this.scheduleOnce(() => cc.director.pause(), 0.23);
    }

    handlerTimer(timerNode: cc.Node) {
        const [ssNode, mmNode] = timerNode.children;
        const ssLabel = ssNode.getComponent(cc.Label);
        const mmLabel = mmNode.getComponent(cc.Label);

        let ss = 0;
        let mm = 0;
        cc.tween(timerNode)
            .to(0.5, { position: cc.v2(-300, 500), rotation: 5 }, { easing: 'sineIn' })
            .start();
        return (dt: number) => {
            const _mm = dt * 100;
            mm += _mm;
            if (mm >= 99) {
                ss++;
                mm = 0;
            }
            ssLabel.string = ss < 10 ? '0' + ss : '' + ss;
            mmLabel.string = mm < 10 ? '0' + Math.round(mm) : '' + Math.round(mm);
            return [ss, mm];
        };
    }

    closeDirection() {
        this.direction.active = false;
        this.direction.destroy();
        this.onTimer = this.handlerTimer(this.timer);
        this.playStart();
    }
}

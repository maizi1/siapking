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
    readyNode: cc.Node;
    @property(cc.Node)
    goNode: cc.Node;
    @property(cc.Node)
    outLabelNode: cc.Node;
    @property(cc.Node)
    scoreNode: cc.Node;
    @property(cc.Node)
    homeBtn: cc.Node;

    score: string = '';
    maxSlapNum: number = 37;
    slapNum: number = 0;
    isStart: boolean = false;
    isOut: boolean = false;
    isPause: boolean = false;
    onTimer: (dt: number) => number[];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.onTimer = this.handlerTimer(this.timer);
        cc.tween(this.slapNumNode)
            .to(0.5, { position: cc.v2(-7, -150) }, { easing: 'sineIn' })
            .start();
        cc.tween(this.readyNode)
            .to(0.4, { position: cc.v2(0, -3) })
            .delay(0.3)
            .by(0.4, { position: cc.v2(-360) })
            .start();
        cc.tween(this.goNode)
            .delay(1.1)
            .to(0.4, { position: cc.v2(0, -3) })
            .delay(0.3)
            .by(0.4, { position: cc.v2(-360) })
            .start();
        console.log(this.slapNumLabel);
    }

    start() {}

    update(dt: number) {
        if (this.isStart) {
            this.onTimer(dt);
        }
        if (this.slapNum > 8 && this.slapNumNode.opacity > 0) {
            this.slapNumNode.opacity -= 40;
        }
        if (this.slapNum > this.maxSlapNum && !this.isOut) {
            this.onOut();
        }
    }

    writeScore() {
        const { localStorage } = cc.sys;
        const date = new Date();
        let fmt = 'yyyy-MM-dd hh:mm'
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
          };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
          }
                
          for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
              fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
            }       
          }
        const scorsObj = {
            day: fmt,
            when: this.onTimer(0),
            scors: this.score,
        };
        let logs = localStorage.getItem('scores');
        logs = logs ? JSON.parse(logs) : [];
        logs.push(scorsObj);
        localStorage.setItem('scores', JSON.stringify(logs));
        localStorage.setItem('score', this.score);
    }

    goToHome() {
        cc.director.loadScene('home');
    }

    onslap() {
        if (this.isPause || this.isOut) {
            return;
        }
        const [slapLeft, slapRight, front] = this.slap.children;
        if (!this.isStart) {
            cc.tween(this.timer)
                .to(0.2, { position: cc.v2(-125, 210) }, { easing: 'sineIn' })
                .start();
            this.isStart = true;
            front.active = false;
        }
        if (this.slapNum++ % 2 === 0) {
            slapLeft.active = true;
            slapRight.active = false;
        } else {
            slapLeft.active = false;
            slapRight.active = true;
        }
        this.slapNumLabel.string = '' + this.slapNum;
        console.log(this.slapNum);

    }

    onDone() {
        if (this.isOut) {
            return;
        }
        if (this.slapNum === this.maxSlapNum) {
            this.isStart = false;
            this.isOut = true;
            this.onScore();
            this.writeScore();
        } else {
            // 失败
            // this.onOut();
            this.onScore();
        }
    }

    onScore() {
        const { tween } = cc;
        const ss = this.onTimer(0)[0];
        console.log(this.scoreNode.children)
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
            } else {
                rulerBox.active = true;
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
    }

    onOut() {
        const { out } = this;
        const { children } = out;
        const difSlapNum = this.slapNum - this.maxSlapNum;
        this.isStart = false;
        this.isOut = true;
        this.writeScore();
        this.outLabelNode.children[0].getComponent(cc.Label).string = `距离成功${
            difSlapNum > 0 ? '多' : '少'
        }点击了${Math.abs(difSlapNum)}次\n点击右上方按钮重新开始`;
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
        cc.tween(this.outLabelNode)
            .delay(1.6)
            .to(0.4, { scale: 0.75 }, { easing: 'sineInOut' })
            .start();
    }

    onReset() {
        cc.director.resume();
        cc.director.loadScene('solo');
    }

    onPause() {
        if (this.isPause) {
            cc.director.resume();
            this.pauseNode.active = false;
            this.isPause = false;
            return;
        }
        this.pauseNode.active = true;
        this.isPause = true;
        cc.director.pause();
    }

    handlerTimer(timerNode: cc.Node) {
        const [ssNode, mmNode] = timerNode.children;
        const ssLabel = ssNode.getComponent(cc.Label);
        const mmLabel = mmNode.getComponent(cc.Label);

        let ss = 0;
        let mm = 0;
        cc.tween(timerNode)
            .to(0.5, { position: cc.v2(-140, 210), rotation: 5 }, { easing: 'sineIn' })
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
}

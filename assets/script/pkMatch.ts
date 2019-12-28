// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

function vs(node: cc.Node, callBack) {
    const skeleton = node.getComponent(sp.Skeleton);
    const track = skeleton.setAnimation(0, 'animation', false);

    skeleton.setTrackCompleteListener(track, callBack);
}

function match(node: cc.Node) {
    const {
        children: [{ children: animations }, { children: icons }],
    } = node;
    const { tween } = cc;
    let icon1: cc.SpriteFrame, icon2: cc.SpriteFrame;
    cc.loader.loadRes('icon/1', cc.SpriteFrame, (err, spr: cc.SpriteFrame) => {
        if (!err) {
            icon1 = spr;
        }
    });

    tween(icons[0])
        .to(0.6, { scale: 1 })
        .start();
    tween(icons[1])
        .to(0.6, { scale: 1 })
        .start();

    const skeleton1 = animations[0].getComponent(sp.Skeleton);
    const skeleton2 = animations[1].getComponent(sp.Skeleton);

    const track1 = skeleton1.setAnimation(0, 'Match1', true);
    const track2 = skeleton2.setAnimation(0, 'Match1', true);

    skeleton2.addAnimation(0, 'Match2', false, 5);
    skeleton2.addAnimation(0, 'Match3', false, 0.5);
    // skeleton1.setTrackCompleteListener(track1, callBack);
    // skeleton2.setTrackCompleteListener(track2, callBack);
}

export default function play(node: cc.Node) {
    vs(node.children[0], () => match(node.children[1]));
}

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default function play(node: cc.Node, callback: () => void) {
    vs(node.children[0], () => match(node.children[1], callback));
}

function vs(node: cc.Node, callback: () => void) {
    const skeleton = node.getComponent(sp.Skeleton);
    const track = skeleton.setAnimation(0, 'animation', false);

    skeleton.setTrackCompleteListener(track, callback);
}

function match(node: cc.Node, callback: () => void) {
    const {
        children: [{ children: animations }, { children: icons }],
    } = node;
    const isLoad = [];

    loadRes('icon/2', icons[2]);
    loadRes('icon/3', icons[4]);
    zoom(icons[0], icons[1]);

    const random = Math.random() * 1 + 1.5;
    const isDelay = Math.random() < 0.5 ;
    const skeleton1 = animations[0].getComponent(sp.Skeleton);
    const skeleton2 = animations[1].getComponent(sp.Skeleton);

    handlerSkeleton(skeleton1, icons[2], icons[3], isDelay ? random : 0, isLoad, callback);
    handlerSkeleton(skeleton2, icons[4], icons[5], isDelay ? 0 : random, isLoad, callback);
}

function handlerSkeleton(
    skeleton: sp.Skeleton,
    iconNode: cc.Node,
    nameNode: cc.Node,
    random: number,
    isLoad: boolean[],
    callback: () => void
) {
    skeleton.setAnimation(0, 'Match1', true);
    skeleton.addAnimation(0, 'Match2', false, 1.5 + random);
    const track = skeleton.addAnimation(0, 'Match3', false, 0.6);

    skeleton.setTrackCompleteListener(track, () => {
        zoom(iconNode, nameNode);
        isLoad.push(true);
        if (isLoad.length === 2) {
            callback()
        }
    });
}

function zoom(node1: cc.Node, node2: cc.Node) {
    const { tween } = cc;
    tween(node1)
        .to(0.6, { scale: 1 })
        .start();
    tween(node2)
        .to(0.6, { scale: 1 })
        .start();
}

function loadRes(path: string, node: cc.Node) {
    let sprite: cc.SpriteFrame;
    cc.loader.loadRes(path, cc.SpriteFrame, (err, spr: cc.SpriteFrame) => {
        if (!err) {
            node.getComponent(cc.Sprite).spriteFrame = spr;
        }
    });

    return sprite;
}

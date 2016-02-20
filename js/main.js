var squareSize = 20;
var mapStage = [];
var stage = null;
var player = null;

var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;

var SOUND_LOSE = 1;

function init() {
    initStage();
    initPlayer();
    initEvent();
    initSound();
}

function initSound () {
    createjs.Sound.registerSound("sound/lose.mp3", SOUND_LOSE);
}

function initStage() {
    stage = new createjs.Stage("demoCanvas");

    addStageColumn([0]);
    addStageColumn([0]);
    addStageColumn([0]);
    addStageColumn([1, 0, 1, 0, 1]);
    addStageColumn([1, 0, 1, 1, 1]);
    addStageColumn([1, 0, 0, 0, 1]);
    addStageColumn([1, 1, 1, 0, 1]);
    addStageColumn([1, 0, 1, 0, 1]);
    addStageColumn([1, 1, 1, 1, 1]);
    addStageColumn([0, 0, 0, 0, 1]);
    addStageColumn([1, 1, 1, 1, 1]);
    addStageColumn([1, 0, 0, 0, 1]);
    addStageColumn([1, 0, 0, 0, 1]);
    addStageColumn([1, 0, 0, 0, 1]);
    addStageColumn([1, 1, 1, 1, 1]);
    addStageColumn([0, 1, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 1]);
    addStageColumn([0, 1, 0, 0, 1]);
    addStageColumn([0, 1, 1, 1, 1, 1, 1, 1, 1]);
    addStageColumn([0, 0, 0, 0, 0, 0, 0, 0, 1]);
    addStageColumn([0, 1, 1, 1, 1, 1, 1, 1, 1]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
}

function initPlayer() {
    // var player = new createjs.Shape();
    // player.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, squareSize - 5);
    player = new createjs.Bitmap("img/player.png");
    player.scaleX = (squareSize * 2 / player.image.width);
    player.scaleY = (squareSize * 2 / player.image.height);
    // @TODO: set place from mapStage.
    player.x = 120;
    player.y = 0;
    player.mapX = 3
    player.mapY = 0;
    stage.addChild(player);
    stage.update();
}

function initEvent() {
    window.onkeydown = keyDownHandler;
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", handleTick);
}

function handleTick(event) {
    player.x -= 1;

    if (player.x < -squareSize)
    {
        createjs.Ticker.removeEventListener("tick", handleTick);
        createjs.Sound.play(SOUND_LOSE);
        alert('You lose');
        return;
    }

    for (var x = 0; x < mapStage.length; x++)
    {
        for (var y = 0; y < mapStage[x].length; y++)
        {
            if (!mapStage[x][y])
            {
                continue;
            }

            // Logic cho nay co the bi sai, trong truong hop nguyen row khong co square nao.
            mapStage[x][y].shape.x -= 1;
            if (mapStage[x][y].shape.x < -squareSize) // gia tri cho nay cung do square dung circle luon.
            {
                removeNFirstColumnOfStage(x + 1);
                x--; // reduce to retry with first row;
                createMoreStage();
                break;
            }
        }
    }

    stage.update();
}

function removeNFirstColumnOfStage(n) {
    var column = null;
    for (var i = 0; i < n; i++)
    {
        player.mapX -= 1;
        column = mapStage.shift();
        for (var j = 0; j < column.length; j++)
        {
            if (column[j])
            {
                stage.removeChild(column[j].shape);
            }
        }
    }

    stage.update();
}

function createMoreStage() {
    addStageColumn([0, 1, 0, 0, 0, 0, 0, 0, 0]);
}

function keyDownHandler(e)
{
    switch (e.keyCode)
    {
        case KEYCODE_LEFT:
            moveTo(player.mapX - 1, player.mapY);
            break;
        case KEYCODE_RIGHT:
            moveTo(player.mapX + 1, player.mapY);
            break;
        case KEYCODE_UP:
            moveTo(player.mapX, player.mapY - 1);
            break;
        case KEYCODE_DOWN:
            moveTo(player.mapX, player.mapY + 1);
            break;
    }
}

function moveTo(x, y) {
    if (mapStage[x] && mapStage[x][y])
    {
        // @TODO: co cai squareSize o day la do player dung bit map, con square dung circle draw, nen cach tinh vi tri hoi khac nhau. can update het ve bitmap.
        player.x = mapStage[x][y].shape.x - squareSize;
        player.y = mapStage[x][y].shape.y - squareSize;
        player.mapX = x;
        player.mapY = y;
        // @TODO: play move sound here.
        stage.update();
    }
}

function addStageColumn(column) {
    var square = null;
    var _column = [];
    for (var i = 0; i < column.length; i++)
    {
        if (!column[i])
        {
            _column.push(null);
            continue;
        }

        square = new createjs.Shape();
        square.graphics.beginFill("Green").drawCircle(0, 0, squareSize);
        square.x = squareSize * (mapStage.length * 2 + 1);
        square.y = squareSize * (i * 2 + 1);
        stage.addChildAt(square, 0);
        _column.push({
            shape: square
        })
    }

    mapStage.push(_column);
    stage.update();
}
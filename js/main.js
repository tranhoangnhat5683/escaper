var STATE_MENU = 0;
var STATE_PLAY = 1;
var STATE_OVER = 2;

var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;

var game_state = STATE_MENU;
var score = 0;
var squareSize = 8;
var playerSize = 6
var mapSizeX = 15;
var mapSizeY = 15;
var mapStage = [];
var stage = null;
var player = null;
var onAddNewStageFlag = false;

var SOUND_LOSE = 1;
var SOUND_MOVE = SOUND_LOSE + 1;

function initOnce()
{
    initEvent();
    initSound();
}

function newGame()
{
    game_state = STATE_PLAY;

    $('#game_menu').hide();
    $('#game_over').hide();
    $('#game_play').show();
    score = 0;
    mapStage = [];
    onAddNewStageFlag = false;
    initStage();
    initPlayer();
}

function gameover()
{
    game_state = STATE_OVER;
    createjs.Sound.play(SOUND_LOSE);

    $('#game_menu').hide();
    $('#game_over').show();
    $('#game_play').hide();
}

function initSound () {
    createjs.Sound.registerSound("sound/lose.mp3", SOUND_LOSE);
    createjs.Sound.registerSound("sound/move.mp3", SOUND_MOVE);
}

function initStage() {
    stage = new createjs.Stage("demoCanvas");

    addStageColumn([0, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 0, 1, 1, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 1, 1, 1, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 1, 1, 1, 0, 0, 0]);
    addStageColumn([0, 0, 0, 0, 1, 0, 1, 0, 0, 0]);
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
}

function initPlayer() {
    player = new createjs.Shape();
    player.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, playerSize);
    // player = new createjs.Bitmap("img/player.png");
    // player.scaleX = (squareSize * 2 / player.image.width);
    // player.scaleY = (squareSize * 2 / player.image.height);
    // @TODO: set place from mapStage.
    player.mapX = 3;
    player.mapY = 5;
    player.x = squareSize * (player.mapX * 2 + 1);
    player.y = squareSize * (player.mapY * 2 + 1);
    stage.addChild(player);
    stage.update();
}

function initEvent() {
    window.onkeydown = keyDownHandler;
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", handleTick);
}

function handleTick(event) {
    switch (game_state)
    {
        case STATE_PLAY:
            $('.score').text(score);
            player.x -= 1;
        
            if (player.x < -squareSize)
            {
                gameover();
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
                    if (mapStage[x][y].shape.x < 0) // gia tri cho nay cung do square dung circle luon.
                    {
                        removeNFirstColumnOfStage(x + 1);
                        x--; // reduce to retry with first row;
                        if (mapStage.length < 100)
                        {
                            createMoreStage();
                        }
                        break;
                    }
                }
            }
        
            stage.update();
            break;
    }
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
    if (onAddNewStageFlag)
    {
        return;
    }

    onAddNewStageFlag = true;
    randomLabyrinth(mapSizeX, mapSizeY, function(err, lab_txt) {
        lab_txt.shift();
        lab_txt.pop();

        createConnectionWithNewStage(lab_txt);

        var doIt = function() {
            if (!lab_txt.length)
            {
                onAddNewStageFlag = false;
                return;
            }

            addStageColumn(lab_txt.shift());
            setTimeout(function() {
                doIt();
            }, 5)
        }
        doIt();
    });
}

function createConnectionWithNewStage(lab_txt)
{
    var last = mapStage.length - 1;
    var connection = [];
    var out = random1FromArray(mapStage[last]);

    console.log(out, lab_txt[0]);
    for (i = out; i >= 0; i--)
    {
        if (lab_txt[0][i])
        {
            for (var j = out; j >= i; j--)
            {
                connection[j] = 1;
            }
            addStageColumn(connection);
            return;
        }
    }

    for (i = out; i < lab_txt[0].length; i++)
    {
        if (lab_txt[0][i])
        {
            for (j = out; j <= i; j++)
            {
                connection[j] = 1;
            }
            addStageColumn(connection);
            return;
        }
    }
}

function keyDownHandler(e)
{
    switch (game_state)
    {
        case STATE_PLAY:
        switch (e.keyCode)
        {
            case KEYCODE_LEFT:
                createjs.Sound.play(SOUND_MOVE);
                moveTo(player.mapX - 1, player.mapY, score - 1);
                break;
            case KEYCODE_RIGHT:
                createjs.Sound.play(SOUND_MOVE);
                moveTo(player.mapX + 1, player.mapY, score + 1);
                break;
            case KEYCODE_UP:
                createjs.Sound.play(SOUND_MOVE);
                moveTo(player.mapX, player.mapY - 1, score);
                break;
            case KEYCODE_DOWN:
                createjs.Sound.play(SOUND_MOVE);
                moveTo(player.mapX, player.mapY + 1, score);
                break;
        }
        break;
    }
}

function moveTo(x, y, newScore) {
    if (mapStage[x] && mapStage[x][y])
    {
        // @TODO: co cai squareSize o day la do player dung bit map, con square dung circle draw, nen cach tinh vi tri hoi khac nhau. can update het ve bitmap.
        score = newScore;
        player.x = mapStage[x][y].shape.x;
        player.y = mapStage[x][y].shape.y;
        player.mapX = x;
        player.mapY = y;
        // @TODO: play move sound here.
        stage.update();
    }
}

function addStageColumn(column) {
    var square = null;
    var _column = [];
    var last = null;
    if (!mapStage.length)
    {
        last = {
            x: -squareSize
        }
    }
    else
    {
        last = mapStage[mapStage.length - 1][random1FromArray(mapStage[mapStage.length - 1])].shape;
    }

    for (var i = 0; i < column.length; i++)
    {
        if (!column[i])
        {
            _column.push(null);
            continue;
        }

        square = new createjs.Shape();
        square.graphics.beginFill("Green").drawCircle(0, 0, squareSize);
        square.x = last.x + (squareSize * 2);
        square.y = squareSize * (i * 2 + 1);
        stage.addChildAt(square, 0);
        _column.push({
            shape: square
        })
    }

    mapStage.push(_column);
    stage.update();
}

function random1FromArray(arr)
{
    if (!arr || !arr.length)
    {
        throw new Error('empry arr');
    }

    var index = 0;
    do
    {
        index = randomNumber(0, arr.length);
    }
    while(!arr[index]);

    return index;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
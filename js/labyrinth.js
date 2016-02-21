function jsrinth(params, callback) {
    'use strict';

    var w = params.width,
            h = params.height,
            added,
            frontier,
            cell;

    function shuffle(arr) {
        var i, tmp, rand_i;
        for (i = 1; i < arr.length; i += 1) {
            rand_i = i + Math.floor(Math.random() * (arr.length - i)) - 1;
            tmp = arr[i];
            arr[i] = arr[rand_i];
            arr[rand_i] = tmp;
        }
    }

    function listNeighbors(cell) {
        var neigh, x, y;

        neigh = [];
        x = cell.x;
        y = cell.y;
        if (y > 0) {
            neigh.push(new Cell(x, y - 1));
        }
        if (y < h - 1) {
            neigh.push(new Cell(x, y + 1));
        }
        if (x > 0) {
            neigh.push(new Cell(x - 1, y));
        }
        if (x < w - 1) {
            neigh.push(new Cell(x + 1, y));
        }
        if (neigh.length < 2) {
            throw "Too few neighbors for " + x + "," + y + ".";
        }
        shuffle(neigh);
        return neigh;
    }

    function Cell(x, y) {
        this.x = x;
        this.y = y;
        this.id = y * w + x;
    }

    function addToFrontier(cells) {
        var i, cell;

        for (i = 0; i < cells.length; i += 1) {
            cell = cells[i];
            if (added[cell.id] === undefined && frontier[cell.id] === undefined) {
                frontier[cell.id] = cell;
                frontier.size += 1;
            }
        }
    }

    function frontierTake() {
        var key, choice, chance, i;

        chance = 1;
        i = 1;
        for (key in frontier) {
            if (frontier.hasOwnProperty(key) && key !== 'size') {
                if (Math.random() <= chance) {
                    choice = key;
                }
                i += 1;
                chance *= (i - 1) / i;
            }
        }
        cell = frontier[choice];
        delete frontier[choice];
        frontier.size -= 1;
        return cell;
    }

    function linkCell(outsider) {
        var i, neigh, neighbors;

        neighbors = listNeighbors(outsider);
        for (i = 0; i < neighbors.length; i += 1) {
            neigh = neighbors[i];
            if (added[neigh.id] !== undefined) {
                if (neigh.y > outsider.y) {
                    params.onWall(outsider.x, outsider.y, 'down');
                }
                else if (neigh.y < outsider.y) {
                    params.onWall(outsider.x, outsider.y, 'up');
                }
                else if (neigh.x > outsider.x) {
                    params.onWall(outsider.x, outsider.y, 'right');
                }
                else if (neigh.x < outsider.x) {
                    params.onWall(outsider.x, outsider.y, 'left');
                }
                else {
                    throw "Outside has the same coordinates as neighbor: " + x + ", " +
                            y + ".";
                }
                addToFrontier(neighbors);
                added[outsider.id] = outsider;
                return;
            }
        }
    }

    frontier = {
        size: 0
    };
    added = {};
    cell = new Cell(Math.floor(Math.random() * w),
            Math.floor(Math.random() * h));
    added[cell.id] = cell;
    addToFrontier(listNeighbors(cell));

    (function doIt()
    {
        if (frontier.size > 0)
        {
            linkCell(frontierTake());
            setTimeout(function() {
                doIt();
            }, 5);
            return;
        }

        callback();
    })();
}

function randomLabyrinth(width, height, options, callback) {
    'use strict';

    if (options instanceof Function)
    {
        callback = options;
        options = {};
    }

    var wall = options.wall || 0;
    var path = options.path || 1;

    var lab, x, y, lab_txt, i, line0, line1, adds;

    lab = [];
    lab_txt = [];
    line0 = [];
    line1 = [];
    adds = 0;

    for (i = 0; i < width; i++) {
        line0.push(wall);
        line0.push(wall);
    }
    line0.push(wall);
    for (i = 0; i < width; i++) {
        line1.push(wall);
        line1.push(path);
    }
    line1.push(wall);

    for (i = 0; i < height; i++) {
        lab_txt.push(JSON.parse(JSON.stringify(line0)));
        lab_txt.push(JSON.parse(JSON.stringify(line1)));
    }
    lab_txt.push(JSON.parse(JSON.stringify(line0)));

    jsrinth({
        width: width,
        height: height,
        onWall: function(x, y, dir) {
            var cell_i, cell_j;

            cell_i = 1 + y * 2;
            cell_j = 1 + x * 2;

            adds++;

            switch (dir) {
                case 'up':
                    lab_txt[cell_i - 1][cell_j] = path;
                    break;
                case 'down':
                    lab_txt[cell_i + 1][cell_j] = path;
                    break;
                case 'left':
                    lab_txt[cell_i][cell_j - 1] = path;
                    break;
                case 'right':
                    lab_txt[cell_i][cell_j + 1] = path;
                    break;
            }
        }
    }, function() {
        callback(null, lab_txt);
    });
}
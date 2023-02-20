var size = 50;
var size2 = size

document.getElementById("size").value = size;
//document.getElementById("size2").value = size;
resizeGrid(size, size2);

function resizeGrid(cols, rows) {
    size = cols;
    size2 = rows;
    console.log("C: " + String(size));
    console.log("R: " + String(size2));

    var grid = document.getElementById("grid");

    var cellWidth = 1 / cols * 100;
    console.log("cellWidth: " + String(cellWidth));

    var cellHeight = 1 / rows * 100;
    console.log("cellHeight: " + String(cellHeight));


    while (grid.lastChild) {
      grid.removeChild(grid.lastChild);
    }


    for (var r = 0; r < rows; r++) {
        var thisRow = document.createElement("div");
        thisRow.className = "grid-row";
        thisRow.style.height = String(cellHeight) + "%";
        grid.appendChild(thisRow);

        for (var c = 0; c < cols; c++) {
            var thisCell = document.createElement("div");
            thisCell.classList.add("cell");
            thisCell.id = "r" + String(r) + "-c" + String(c)
            thisCell.style.width = String(cellWidth) + "%";
            thisCell.style.height = "100%";
            thisCell.onclick = function() { this.classList.toggle("alive"); };
            //thisCell.onclick = function() { getNewStatus(this.id); };
            thisRow.appendChild(thisCell);



        }

    }

    //kockasGrid();
    randomValues();
}



var isRunning = false; 
var interval;

function stopEvolving() {
    clearInterval(interval);
    var button = document.getElementById("startButton");
    isRunning = false;
    button.value = "stopped";
    button.innerHTML = "Indítás";
    document.getElementById("speed").disabled = false;
    document.getElementById("size").disabled = false;
    document.getElementById("resize").disabled = false;
    document.getElementById("evolve").disabled = false;
}

function toggleEvolve(button) {
    console.log(button.value);

    if (button.value === "stopped") {
        isRunning = true;
        button.value = "running";
        button.innerHTML = "Megállítás";
        var slider = document.getElementById("speed");
        var size = document.getElementById("size");
        var resize = document.getElementById("resize");
        var evolve = document.getElementById("evolve");

        var speed = slider.value;
        /*var sizeSize = size.value;
        var sizeSize2 = sizeSize;*/


        console.log(speed);
        slider.disabled = true;
        size.disabled = true;
        resize.disabled = true;
        evolve.disabled = true;

        interval = setInterval(function() { updateGrid(); }, speed);
    } else {
        stopEvolving();
    }

}



function updateGrid() {
    var allCells = document.getElementsByClassName("cell");
    var newStatuses = {}
    for (var i = 0; i < allCells.length; i++) {

        var thisId = allCells[i].id;
        newStatuses[thisId] = getNewStatus(thisId);
    }
    for (var i = 0; i < allCells.length; i++) {

        var thisCell = allCells[i];
        var willLive = newStatuses[thisCell.id];
        thisCell.classList.toggle("alive", willLive); 
    }

}


function getNewStatus(cellId) {
    var pals = countAliveNeighbors(cellId);
    var cell = getCell(cellId);
    var isAlive = cell.classList.contains("alive");

    if (isAlive) { 
        if (pals < 2 || pals > 3) { 
          
            isAlive = false; 
        } else {
           
        }
    } else { 
        if (pals === 3) {
           
            isAlive = true;
        } else {
        
        }
    }

    return isAlive;
}




function countAliveNeighbors(cellId) {
    var neighborList = findNeighbors(cellId);
    var liveOnes = 0;
    neighborList.forEach( function(cellId) {
        var neighbor = getCell(cellId);
        if (neighbor === null) {
            console.Log(cellId);
            return;
        }
        if (neighbor.classList.contains("alive")) {
            liveOnes += 1;
        }
    });

    return liveOnes;
}


function findNeighbors(cellId) {
    var coords = parseCellId(cellId);
    //console.log("coords", coords);

    var deltaList = [   [-1,-1],[-1,0], [-1,1],
				        [0,-1],         [0,1],
				        [1,-1], [1,0],  [1,1]
                    ];

    var neighborList = []; 

    deltaList.forEach( function(dels) {

        var newR = coords[0] + dels[0];
        var newC = coords[1] + dels[1];
        if (newR < 0 || newC < 0 || newR >= size || newC >= size2) {

        } else {
            var newId = getCellId([newR, newC]);
            neighborList.push(newId);
        }
    });

    //console.log(neighborList);
    return neighborList;
}

function parseCellId(cellId) {
    var splitted = cellId.split("-");
    //console.log(splitted);
    var thisR = parseInt(splitted[0].slice(1));
    var thisC = parseInt(splitted[1].slice(1));
    //console.log("thisR: ", thisR, " thisC: ", thisC);
    return [thisR, thisC];
}


function getCellId(coordList) {
    return "r" + String(coordList[0]) + "-c" + String(coordList[1]);
}

function getCell(cellId) {
    return document.getElementById(cellId);
}

function clearGrid() {
    stopEvolving();
    var allCells = document.getElementsByClassName("cell");
    for (var i = 0; i < allCells.length; i++) {
        allCells[i].classList.remove("alive");
    }
}


function kockasGrid() {
    stopEvolving();
    var allCells = document.getElementsByClassName("cell");
    for (var i = 0; i < allCells.length; i++) {
        var thisCell = allCells[i];
        var coords = parseCellId(thisCell.id);
        var r = coords[0], c = coords[1];
        if (r % 2 === 0 && c % 2 === 0 || r % 2 === 1 && c %2 === 1) {
            thisCell.classList.add("alive");
        } else {
            thisCell.classList.remove("alive");
        }
    }
}

function randomValues() {
    stopEvolving();
    var allCells = document.getElementsByClassName("cell");
    for (var i = 0; i < allCells.length; i++) {
        var randomBool = Math.random() >= 0.5;
        allCells[i].classList.toggle("alive", randomBool);
    }
}

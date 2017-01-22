var myGamePiece;
var myObstacles = [];
var passedObstacles = -3; //preminati prepqtsviq pochvat ot -3 zashtoto purvite qrdove sa poveche ot 200 milisekundi,otdelno si ima proverka otdolu taka che spox
var highestScore = 0; //tva e za cheka dali sa ravni dali e po golqm..

function startGame() {
    /*myGamePiece = new component(30, 30, "red", 10, 120);*/
    myGamePiece = new component(50, 45, "sail-boat.gif", 30, 140, "image");
    myGameArea.start();
	//disable-vane na butoni i malko muzika..
	document.getElementById("start_button").disabled = true;
	document.getElementById("up_button").disabled = false;
	document.getElementById("down_button").disabled = false;
	document.getElementById("reset_button").disabled = false;
	document.getElementById("startup_logo").style.visibility = "hidden";
	var audio = new Audio('Pirates Of The Caribbean Theme Song (Music Video).mp3');
	audio.play();

}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
         this.canvas.style.cursor = "none"; //hide the original cursor
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousemove', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        window.addEventListener('touchmove', function (e) {
            myGameArea.x = e.touches[0].screenX;
            myGameArea.y = e.touches[0].screenY;

        })
         window.addEventListener('touchend', function (e) {
            myGameArea.x = false;
            myGameArea.y = false;
        })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
		document.getElementById("up_button").disabled = true;
		document.getElementById("down_button").disabled = true;
		document.getElementById("reset_button").disabled = false;
    }
}

function component(width, height, color, x, y,type) {
    this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }

    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;

        if (type == "image") {
        ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        } 
	}
    myGameArea.clear();
	
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "blue", x, 0));
        myObstacles.push(new component(10, x - height - gap, "lightblue", x, height + gap));
		if(myGameArea.frameNo == 1 || everyinterval(150)){ // proverka za preminati pregradi
		passedObstacles++;
		if(passedObstacles>0){
		document.getElementById("score").innerHTML = passedObstacles;
		}
		else
		{
		document.getElementById("score").innerHTML = 0;	}
		}
		
		if(passedObstacles > highestScore){ // proverka za preminati rekordi
		highestScore = passedObstacles;
		document.getElementById("high").innerHTML =  highestScore;
		}
		else
		{
		document.getElementById("high").innerHTML =  highestScore;
		}
    	}
	
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myGamePiece.newPos();
    if (myGameArea.x && myGameArea.y) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = myGameArea.y; 
    }

    if (myGameArea.touchX && myGameArea.touchY) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = myGameArea.y;
        
    }
    
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function move(button) {
    myGamePiece.image.src = "sail-boat.gif";
    if (button == "up") {myGamePiece.speedY = -1; }
    if (button == "down") {myGamePiece.speedY = 1; }
    if (button == "left") {myGamePiece.speedX = -1; }
    if (button == "right") {myGamePiece.speedX = 1; }
}

function clearmove() {
	myGamePiece.image.src = "sail-boat.gif";
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}

//


function gameover() { // funkciq za restart
	
//tva e napraveno s biblioteka koqto sum svalil backedgoods ama taka i ne mi trugna nz zashto.. :@
/*bakedGoods.set({  
    data: [{key: "scoreFile", value: highestScore, dataFormat: "text/plain"}],
    storageTypes: ["fileSystem"],
    options: {fileSystem:{storageType: Window.PERSISTENT}},
    complete: function(byStorageTypeStoredItemRangeDataObj, byStorageTypeErrorObj){}
});*/	
	
	
document.getElementById("start_button").disabled = false;
//immeno zaradi tova trqbva da se zapishe rekorda na igracah zashtoto sled tova vsichko se restartva..
location.reload();
}

/*Write to txt file*/
/*function WriteToFile(passForm) {

    set fso = CreateObject("Scripting.FileSystemObject");  
    set s = fso.CreateTextFile("C:\test.txt", True);
    s.writeline(document.getElementById('high').value);
    s.Close();
 }*/


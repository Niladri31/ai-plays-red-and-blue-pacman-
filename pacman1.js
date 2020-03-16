
"use strict";

function geronimo() {
/* ----- Global Variables ---------------------------------------- */
	var canvas;
	//var joystick;
	var context;
	var game;
	var canvas_walls, context_walls;
	var inky, blinky, clyde, pinky;
	  var flagdraw=0;
	  var flagdrawghostpinky=0;
	  var flagdrawghostblinky=1;
	  var flagdrawghostclyde=1;
	  var flagdrawghostinky=1;

	  var flag=0;
	  
	  var flag2=0;
	  var y=0;
    var timervalue=    Number(y);

	var mapConfig = "data/map.json";







	 setInterval( function ( ) { 

timervalue++;


		 }, 1000 );



	
	function between(x, min, max) {
		return x >= min && x <= max;
	}
	function Game() {
	//	this.timer = new Timer();
		this.refreshRate = 33;		// speed of the game, will increase in higher levels
		this.running = false;
		this.pause = true;
		this.score = new Score();
		//this.score1=new Score();
	
		this.map;
		this.pillCount;				// number of pills
		this.monsters;
	
		this.gameOver = false;
		this.canvas = $("#myCanvas").get(0);
		this.wallColor = "Blue";
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.pillSize = 3;
	
		
		// decrements each animationLoop execution
		this.ghostSpeedNormal = 3
	
		
		this.getMapContent = function (x, y) {
			var maxX = game.width / 30 -1;
			var maxY = game.height / 30 -1;
			if (x < 0) x = maxX + x;
			if (x > maxX) x = x-maxX;
			if (y < 0) y = maxY + y;
			if (y > maxY) y = y-maxY;
			return this.map.posY[y].posX[x].type;
		};

		this.setMapContent = function (x,y,val) {
			this.map.posY[y].posX[x].type = val;
		};
		
		

		this.reset = function() {
			};

	


//PAUSING GAME  **********************************************************************************************************88


		this.showMessage = function(title, text) {
			//this.timer.stop();
			this.pause = true;
			$('#canvas-overlay-container').fadeIn(200);
			if ($('.controls').css('display') != "none") $('.controls').slideToggle(200);
			$('#canvas-overlay-content #title').text(title);
			$('#canvas-overlay-content #text').html(text);
		};

		this.closeMessage = function() {
			$('#canvas-overlay-container').fadeOut(200);
			$('.controls').slideToggle(200);
		};

		this.pauseResume = function () {
			if (!this.running) {
				// start timer
				////this.timer.start();

				this.pause = false;
				this.running = true;
				this.closeMessage();
				animationLoop();
			}
			else if (this.pause) {
				// stop timer
			//	this.timer.stop();

				this.pause = false;
				this.closeMessage();
				}
			else {
				this.showMessage("Pause","Click to Resume");
				}
			};

		this.init = function (state) {
			
			console.log("init game "+state);

			// reset timer if restart
			if( state === 0 ) {
             //   this.timer.reset();
			}
			
			// get Level Map
			$.ajax({
				url: mapConfig,
				async: false,
				 beforeSend: function(xhr){
					if (xhr.overrideMimeType) xhr.overrideMimeType("application/json"); 
				},
				dataType: "json",
				success: function (data) {
					game.map =  data;
				}
			});
		
			var temp = 0;
			$.each(this.map.posY, function(i, item) {
			   $.each(this.posX, function() { 
				   if (this.type == "pill") {
					temp++;
				
					}
				});
			});
			
			this.pillCount = temp;
	
			if (state === 0) {
				this.score.set(0);
				//this.score1.set(0);
				this.score.refreshblue(".score");
				this.score.refreshred(".score1")
				//pacman.lives = 3;
			
				}
		//	pacman.reset();
			
			//game.drawHearts(pacman.lives);	
			
			this.ghostFrightened = false;
			this.ghostFrightenedTimer = 240;
			this.ghostMode = 1;			// 0 = Scatter, 1 = Chase
			this.ghostModeTimer = 200;	// decrements each animationLoop execution
			
			// initalize Ghosts, avoid memory flooding
			if (pinky === null || pinky === undefined) {
				pinky = new Ghost("pinky",2,2,'img/unnamed.png',2,3);   //blue
				inky = new Ghost("inky",13,1,'img/blinky.svg',13,13);     //red
				blinky = new Ghost("blinky",13,5,'img/blinky.svg',3,5);   //red
 				clyde = new Ghost("clyde",4,9,'img/unnamed.png',11,13);   //blue
			}
			else {
				//console.log("ghosts reset");
				pinky.reset();
				inky.reset();
				blinky.reset()
				clyde.reset();
			}
			
			
			blinky.start();	
			inky.start();
			pinky.start();
			clyde.start();
			pacman1.start();
			pacman.start();
		
		};

		this.check = function() {

                 if((this.score.getblue()) > (this.score.getred()))
				alert(" blue won");
				else if((this.score.getblue()) <(this.score.getred()))
				alert("red won"); 


			
		};

	

		this.toPixelPos = function (gridPos) {
			return gridPos*30;
		};

		this.toGridPos = function (pixelPos) {
			return ((pixelPos % 30)/30);
		};

		function buildWall(context,gridX,gridY,width,height) {
			console.log("BuildWall");
			if(gridX>7)
			{
				context.fillStyle="Red";
				
			}
			else{
				context.fillStyle="Blue";
			}
			width = width*2-1;
			height = height*2-1;
			context.fillRect(15/2+gridX*2*15,15/2+gridY*2*15, width*15, height*15);
		}
		

		/* ------------ Start Pre-Build Walls  ------------ */
		this.buildWalls = function() {
	
			
			
			canvas_walls = document.createElement('canvas');
			canvas_walls.width = game.canvas.width;
			canvas_walls.height = game.canvas.height;
			context_walls = canvas_walls.getContext("2d");

			
			//horizontal outer
			buildWall(context_walls,0,0,9.2,1);
			
			buildWall(context_walls,8.7,0,9.3,1);
			buildWall(context_walls,0,12,9.2,1);
			buildWall(context_walls,8.7,12,9.3,1);
	
			// vertical outer
			buildWall(context_walls,0,0,1,13);
		//	buildWall(context_walls,0,7,1,6);
			buildWall(context_walls,17,0,1,13);
		
			
			// single blocks
			buildWall(context_walls,4,0,1,2);
			buildWall(context_walls,13,0,1,2);
			
			buildWall(context_walls,2,2,1,2);
			buildWall(context_walls,6,2,2,1);
			buildWall(context_walls,15,2,1,2);
			buildWall(context_walls,10,2,2,1);
			
			buildWall(context_walls,2,3,2,1);
			buildWall(context_walls,14,3,2,1);
			buildWall(context_walls,5,3,1,1);
			buildWall(context_walls,12,3,1,1);
			buildWall(context_walls,3,3,1,3);
			buildWall(context_walls,14,3,1,3);
			
			buildWall(context_walls,3,4,1,1);
			buildWall(context_walls,14,4,1,1);
			
			buildWall(context_walls,0,5,2,1);
			buildWall(context_walls,3,5,2,1);
			buildWall(context_walls,16,5,2,1);
			buildWall(context_walls,13,5,2,1);
			
			buildWall(context_walls,0,7,2,2);
			buildWall(context_walls,16,7,2,2);
			buildWall(context_walls,3,7,2,2);
			buildWall(context_walls,13,7,2,2);
			
			buildWall(context_walls,4,8,2,2);
			buildWall(context_walls,12,8,2,2);
			buildWall(context_walls,5,8,3,1);
			buildWall(context_walls,10,8,3,1);
			
			buildWall(context_walls,2,10,1,1);
			buildWall(context_walls,15,10,1,1);

			buildWall(context_walls,7,10,2.5,1);
			buildWall(context_walls,9,10,2.5,1);

			buildWall(context_walls,4,11,2,2);
			buildWall(context_walls,12,11,2,2);
			/* ------------ End Pre-Build Walls  ------------ */

           
		
		};

	}

	game = new Game();


	function Score() {
		this.score = 0;
		this.score1=0
		this.set = function(i) {
			this.score = i;
			this.score1=i;
		};
		this.getblue =function(){
              return this.score;

		}
		this.getred =function(){
			return this.score1;

	  }
		this.add = function(i) {
			this.score += i;
			
		};

		this.add1=function(i)
		{
			this.score1+=i

		}
		this.refreshblue = function(h) {
			$(h).html("Blue Score: "+this.score);
		
		};
		this.refreshred = function(h) {
			$(h).html("Red Score: "+this.score1);
		
		};
		
	}
	
	

	
	
	// Direction object in Constructor notation
	function Direction(name,angle1,angle2,dirX,dirY) {
		this.name = name;
		this.angle1 = angle1;
		this.angle2 = angle2;
		this.dirX = dirX;
		this.dirY = dirY;
		this.equals = function(dir) {
			return  JSON.stringify(this) ==  JSON.stringify(dir);
		};
	}

	var up = new Direction("up",1.75,1.25,0,-1);		// UP
	var left = new Direction("left",1.25,0.75,-1,0);	// LEFT
	var down = new Direction("down",0.75,0.25,0,1);		// DOWN
	var right = new Direction("right",0.25,1.75,1,0);	// right
	

	function directionWatcher() {
		this.dir = null;
		this.set = function(dir) {
			this.dir = dir;
		};
		this.get = function() {
			return this.dir;
		};
	}


	function Ghost(name, gridPosX, gridPosY, image, gridBaseX, gridBaseY) {
		this.name = name;
		this.posX = gridPosX * 30;
		this.posY = gridPosY * 30;
		this.startPosX = gridPosX * 30;
		this.startPosY = gridPosY * 30;
		this.gridBaseX = gridBaseX;
		this.gridBaseY = gridBaseY;
		this.speed = 3;
	

		this.image = new Image();
		this.image.src = image;

		this.direction = up;
		
		this.draw = function (context) {					
	      
			 context.drawImage(this.image, this.posX, this.posY, 2*15, 2*15);
	
		}
		this.undraw=function(context)
		{
			context.drawImage(this.image, this.posX, this.posY, 0, 0);


		}
		this.getCenterX = function () {
			return this.posX+15;
		}
		this.getCenterY = function () {
			return this.posY+15;
		}
		
		this.reset = function() {
			this.dead = false;
			this.posX = this.startPosX;
			this.posY = this.startPosY;
		
		}
		
		this.die = function() {
            if (!this.dead) {
            
                this.dead = true;
               
            }
		}

		
		this.move = function() {
		
			this.checkDirectionChange();
			this.checkCollision();
		
	
			
			if (!this.stop) {
			
				this.posX+=this.speed*this.dirX;
				this.posY+=this.speed*this.dirY;
				// Check if out of canvas
				if (this.posX >= game.width-15) this.posX = this.speed-15;
				if (this.posX <= 0-15) this.posX = game.width-this.speed-15;
				if (this.posY >= game.height-15) this.posY = this.speed-15;
				if (this.posY <= 0-15) this.posY = game.height-this.speed-15;
			}
		}
			
		this.checkCollision = function() {
		  
		
		
                       
				/* Check Ghost / Pacman Collision			*/
				if ((between(pacman.getCenterX(), this.getCenterX()-10, this.getCenterX()+10)) 
					&& (between(pacman.getCenterY(), this.getCenterY()-10, this.getCenterY()+10)))
				{
					
						pacman.dieFinal();
						
					
			
            }
        
                       
				/* Check Ghost / Pacman Collision			*/
				if ((between(pacman1.getCenterX(), this.getCenterX()-10, this.getCenterX()+10)) 
					&& (between(pacman1.getCenterY(), this.getCenterY()-10, this.getCenterY()+10)))
				{
				
						pacman1.dieFinal();
						
				
				}
            

		}
		
		/* Pathfinding */
		this.getNextDirection = function() {
			// get next field
			var pX = this.getGridPosX();
			
			var pY= this.getGridPosY();
			game.getMapContent(pX,pY);
			var u, d, r, l; 			// option up, down, right, left
		
		
			 if (game.ghostMode == 1  && pacman.getGridPosX()>8) {			// Chase Mode
				
				switch (this.name) {
			
				case "pinky":             //blue
			
			   
					var tX = pacman1.getGridPosX();
					var tY = pacman1.getGridPosY();

			

              

					break;
				
				// target: pacman
				case "blinky":                 //red
				
					var tX = this.gridBaseX;
					var tY = this.gridBaseY;

				
				 	break;
				
			
				case "inky":                 //red
		
                      
					var tX = pacman.getGridPosX();
					var tY = pacman.getGridPosY();
					break;
				
		
				}
			}	
			else if (game.ghostMode == 1 && pacman1.getGridPosX()<8) {			// Chase Mode
				
				switch (this.name) {
		
				case "pinky":             //blue
	
					var tX = pacman1.getGridPosX();
					var tY = pacman1.getGridPosY();
					break;
				
				// target: pacman
				case "blinky":                 //red
				tX = this.gridBaseX;
					tY = this.gridBaseY;


					break;
				
				// target: 
				case "inky":    
			

                   var tX = pacman.getGridPosX();
					var tY = pacman.getGridPosY();

					break;
			
				case "clyde":               
			
					tX = this.gridBaseX;
					tY = this.gridBaseY;
					break;
				
				}
			}	
			

			
			var oppDir = this.getOppositeDirection();	
			var dirs = [{},{},{},{}];		
			dirs[0].field = game.getMapContent(pX,pY-1);
			dirs[0].dir = up;
			dirs[0].distance = Math.sqrt(Math.pow((pX-tX),2) + Math.pow((pY -1 - tY),2));
			
			dirs[1].field = game.getMapContent(pX,pY+1);
			dirs[1].dir = down;
			dirs[1].distance = Math.sqrt(Math.pow((pX-tX),2) + Math.pow((pY+1 - tY),2));
			
			dirs[2].field = game.getMapContent(pX+1,pY);
			dirs[2].dir = right;
			dirs[2].distance = Math.sqrt(Math.pow((pX+1-tX),2) + Math.pow((pY - tY),2));
			
			dirs[3].field = game.getMapContent(pX-1,pY);
			dirs[3].dir = left;
			dirs[3].distance = Math.sqrt(Math.pow((pX-1-tX),2) + Math.pow((pY - tY),2));
			
			// Sort possible directions by distance
			function compare(a,b) {
			  if (a.distance < b.distance)
				 return -1;
			  if (a.distance > b.distance)
				return 1;
			  return 0;
			}
			var dirs2 = dirs.sort(compare);
			
			var r = this.dir;
			var j;
		
		
				for (var i = dirs2.length-1; i >= 0; i--) {
					if ((dirs2[i].field != "wall")  && !(dirs2[i].dir.equals(this.getOppositeDirection()))) {
						r = dirs2[i].dir;


						}
				}		
			
			this.directionWatcher.set(r);
			return r;
		}
	
		
	}
	
	Ghost.prototype = new Figure();
	






	// Super Class for Pacman & Ghosts
	function Figure() {
		this.posX;
		this.posY;
		this.speed;
		this.dirX = right.dirX;
		this.dirY = right.dirY;
		this.direction;
		this.stop = true;
		this.directionWatcher = new directionWatcher();
		this.getNextDirection = function() { console.log("Figure getNextDirection");};


		
		this.checkDirectionChange = function() {
			if (this.inGrid() && (this.directionWatcher.get() == null)) this.getNextDirection();
			if ((this.directionWatcher.get() != null) && this.inGrid()) {
				//console.log("changeDirection to "+this.directionWatcher.get().name);
				this.setDirection(this.directionWatcher.get());
				this.directionWatcher.set(null);
			}
			
		}
	
		
		this.inGrid = function() {

			if((this.posX % (2*15) === 0) && (this.posY % (2*15) === 0)) return true;
			return false;
		}
		this.getOppositeDirection = function() {
			if (this.direction.equals(up)) return down;
			else if (this.direction.equals(down)) return up;
			else if (this.direction.equals(right)) return left;
			else if (this.direction.equals(left)) return right;
		}

		this.stop = function() { this.stop = true;}
		this.start = function() { this.stop = false;}
		
		this.getGridPosX = function() {
			return (this.posX - (this.posX % 30))/30;
		}
		this.getGridPosY = function() {
			return (this.posY - (this.posY % 30))/30;
		}
		this.setDirection = function(dir) {			
			this.dirX = dir.dirX;
			this.dirY = dir.dirY;
			this.angle1 = dir.angle1;
			this.angle2 = dir.angle2;
			this.direction = dir;
		}
		this.setPosition = function(x, y) {
			this.posX = x;
			this.posY = y;
		}
	}
	

function pacman(image)
{
    this.posX = 9 * 30;
    this.posY = 9 * 30;
    this.startPosX = this.posX;
    this.startPosY = this.posY;
  
    this.speed = 5;
	this.dirX = right.dirX;
	this.dirY = right.dirY;
	

    this.image = new Image();
    this.image.src = image;

    this.direction = up;
   
    this.draw = function (context) {	
		
		

		 context.drawImage(this.image, this.posX, this.posY, 2*15, 2*15);
		
    }
   
    this.reset = function() {
        this.dead = false;
        this.posX = this.startPosX;
        this.posY = this.startPosY;

    }
    
    this.die = function() {
        if (!this.dead) {
            this.dead = true;

        }
    }

    
    this.move = function() {
    
        this.checkDirectionChange();
        this.checkCollision();
		console.log(" Pacman blue at ("+this.getGridPosX()+" , "+this.getGridPosY()+")");

        
        if (!this.stop) {
        
            this.posX+=this.speed*this.dirX;
            this.posY+=this.speed*this.dirY;
            // Check if out of canvas
            if (this.posX >= game.width-15) this.posX = this.speed-15;
            if (this.posX <= 0-15) this.posX = game.width-this.speed-15;
            if (this.posY >= game.height-15) this.posY = this.speed-15;
            if (this.posY <= 0-15) this.posY = game.height-this.speed-15;
        }
    }
        
    this.checkCollision = function() {
      
   
            var gridX = this.getGridPosX();
            var gridY = this.getGridPosY();
             var gridAheadX = gridX;
             var gridAheadY = gridY;
            
             var field = game.getMapContent(gridX, gridY);

             var fieldAhead = game.getMapContent(gridAheadX, gridAheadY);

		
            
            /*	Check Pill Collision			*/
            if (field === "pill")  {
                
                if (
                    ((this.dirX == 1) && (between(this.posX, game.toPixelPos(gridX)+15-5, game.toPixelPos(gridX+1))))
                    || ((this.dirX == -1) && (between(this.posX, game.toPixelPos(gridX), game.toPixelPos(gridX)+5)))
                    || ((this.dirY == 1) && (between(this.posY, game.toPixelPos(gridY)+15-5, game.toPixelPos(gridY+1))))
                    || ((this.dirY == -1) && (between(this.posY, game.toPixelPos(gridY), game.toPixelPos(gridY)+5)))
                    || (fieldAhead === "wall")
                    )
                    {	var s;
                        
                            s = 1;
                            game.pillCount--;
                            
                        game.map.posY[gridY].posX[gridX].type = "null";
                        if(gridX<8)
                        {
                        game.score.add(s);
                        }
                        else if(gridX>8)
                        game.score.add1(s);
                    }
            
            
        }
    
    }
    
    /* Pathfinding */
    this.getNextDirection = function() {
        // get next field
        var pX1= this.getGridPosX();
        
        var pY1= this.getGridPosY();
        game.getMapContent(pX1,pY1);
        var u, d, r, l; 			// option up, down, right, left

				
				var tX1;
				var tY1;
				tX1=13;
				tY1=10;
if(this.getGridPosX()==tX1 && this.getGridPosY()==tY1)
{
	console.log("pacman blue reached 1st destination");
}


				if(timervalue>12)
				{
				 flag=1;
				
				}

	
if(flag==1)
{
	tX1 =14;
	tY1=1;

	if(this.getGridPosX()==tX1 && this.getGridPosY()==tY1)
	{
		console.log("pacman blue reached 2nd destination");
	}
}




        var oppDir = this.getOppositeDirection();	// ghosts are not allowed to change direction 180�
        
        var dirs = [{},{},{},{}];		
        dirs[0].field = game.getMapContent(pX1,pY1-1);
        dirs[0].dir = up;
        dirs[0].distance = Math.sqrt(Math.pow((pX1-tX1),2) + Math.pow((pY1 -1 - tY1),2));
        
        dirs[1].field = game.getMapContent(pX1,pY1+1);
        dirs[1].dir = down;
        dirs[1].distance = Math.sqrt(Math.pow((pX1-tX1),2) + Math.pow((pY1+1 - tY1),2));
        
        dirs[2].field = game.getMapContent(pX1+1,pY1);
        dirs[2].dir = right;
        dirs[2].distance = Math.sqrt(Math.pow((pX1+1-tX1),2) + Math.pow((pY1 - tY1),2));
        
        dirs[3].field = game.getMapContent(pX1-1,pY1);
        dirs[3].dir = left;
        dirs[3].distance = Math.sqrt(Math.pow((pX1-1-tX1),2) + Math.pow((pY1- tY1),2));
        
        // Sort possible directions by distance
        function compare(a,b) {
          if (a.distance < b.distance)
             return -1;
          if (a.distance > b.distance)
            return 1;
          return 0;
        }
        var dirs2 = dirs.sort(compare);
        
        var r = this.dir;
        var j;
        
     
      
            for (var i = dirs2.length-1; i >= 0; i--) {
                if ((dirs2[i].field != "wall")  && !(dirs2[i].dir.equals(this.getOppositeDirection()))) {
                    r = dirs2[i].dir;
                    }
            }		
      
		this.directionWatcher.set(r);
	//	console.log(r.pX1+r.pY1)
        return r;
    }

    	this.getGridPosX = function() {
			return (this.posX - (this.posX % 30))/30;
		}
		this.getGridPosY = function() {
			return (this.posY - (this.posY % 30))/30;
		}


		this.getCenterX = function () {
			return this.posX+15;
		}
		this.getCenterY = function () {
			return this.posY+15;
		}


		this.dieFinal = function() {
			this.reset();
			pinky.reset();
			inky.reset();
			blinky.reset();
			clyde.reset();
		}
			this.reset = function() {
			//this.unfreeze();
			this.posX = 10*30;
			this.posY = 5*2*15;
	
		}
}


	
function pacman1(image)
{
   // this.name = name;
   //15 = 15;
   //var image;



    this.posX = 7 * 30;
    this.posY = 5* 30;
    this.startPosX = this.posX;
    this.startPosY = this.posY;
    // this.gridBaseX = gridBaseX;
    // this.gridBaseY = gridBaseY;
    this.speed = 5;
	this.dirX = left.dirX;
	this.dirY = left.dirY;
	// 	);

    this.image = new Image();
    this.image.src = image;

    this.direction = left;
   
    this.draw = function (context) {					

         context.drawImage(this.image, this.posX, this.posY, 2*15, 2*15);
    }
    this.getCenterX = function () {
        return this.posX+15;
    }
    this.getCenterY = function () {
        return this.posY+15;
    }
    
    this.reset = function() {
        this.dead = false;
        this.posX = this.startPosX;
        this.posY = this.startPosY;
        // this.ghostHouse = true;
        // this.undazzle();
    }
    
    this.die = function() {
        if (!this.dead) {
        
            this.dead = true;
        
        }
    }

    
    this.move = function() {
    
        this.checkDirectionChange();
        this.checkCollision();
    
		console.log(" Pacman red at ("+this.getGridPosX()+" , "+this.getGridPosY()+")");
        
        if (!this.stop) {
        
            this.posX+=this.speed*this.dirX;
            this.posY+=this.speed*this.dirY;
            // Check if out of canvas
            if (this.posX >= game.width-15) this.posX = this.speed-15;
            if (this.posX <= 0-15) this.posX = game.width-this.speed-15;
            if (this.posY >= game.height-15) this.posY = this.speed-15;
            if (this.posY <= 0-15) this.posY = game.height-this.speed-15;
        }
    }
        
    this.checkCollision = function() {

            var gridX = this.getGridPosX();
            var gridY = this.getGridPosY();
             var gridAheadX = gridX;
             var gridAheadY = gridY;
            
             var field = game.getMapContent(gridX, gridY);

             var fieldAhead = game.getMapContent(gridAheadX, gridAheadY);

            
            /*	Check Pill Collision			*/
            if (field === "pill")  {
              
                if (
                    ((this.dirX == 1) && (between(this.posX, game.toPixelPos(gridX)+15-5, game.toPixelPos(gridX+1))))
                    || ((this.dirX == -1) && (between(this.posX, game.toPixelPos(gridX), game.toPixelPos(gridX)+5)))
                    || ((this.dirY == 1) && (between(this.posY, game.toPixelPos(gridY)+15-5, game.toPixelPos(gridY+1))))
                    || ((this.dirY == -1) && (between(this.posY, game.toPixelPos(gridY), game.toPixelPos(gridY)+5)))
                    || (fieldAhead === "wall")
                    )
                    {	var s;
                        
                            s = 1;
                            game.pillCount--;
                            
                        game.map.posY[gridY].posX[gridX].type = "null";
                        if(gridX<8)
                        {
                        game.score.add(s);
                        }
                        else if(gridX>8)
                        game.score1.add1(s);
                    }
            
            
        }
    
    }
    
    /* Pathfinding */
    this.getNextDirection = function() {
        // get next field
        var pX = this.getGridPosX();
        
        var pY= this.getGridPosY();
        game.getMapContent(pX,pY);
        var u, d, r, l; 			
        
   


                 var tX =1;
                 var tY=2;
				 if(timervalue>12)
				 {
				  flag2=1;
				 }
 console.log(timervalue);
	 
 if(this.getGridPosX()==tX && this.getGridPosY()==tY)
{
	console.log("pacman red reached 1st destination");
}
 if(flag2==1)
 {
 
 tX=2;
 tY=10;
 if(this.getGridPosX()==tX && this.getGridPosY()==tY)
 {
	 console.log("pacman red reached 2nd destination");
 }
 
 }
        
        var oppDir = this.getOppositeDirection();	// ghosts are not allowed to change direction 180�
        
        var dirs = [{},{},{},{}];		
        dirs[0].field = game.getMapContent(pX,pY-1);
        dirs[0].dir = up;
        dirs[0].distance = Math.sqrt(Math.pow((pX-tX),2) + Math.pow((pY -1 - tY),2));
        
        dirs[1].field = game.getMapContent(pX,pY+1);
        dirs[1].dir = down;
        dirs[1].distance = Math.sqrt(Math.pow((pX-tX),2) + Math.pow((pY+1 - tY),2));
        
        dirs[2].field = game.getMapContent(pX+1,pY);
        dirs[2].dir = right;
        dirs[2].distance = Math.sqrt(Math.pow((pX+1-tX),2) + Math.pow((pY - tY),2));
        
        dirs[3].field = game.getMapContent(pX-1,pY);
        dirs[3].dir = left;
        dirs[3].distance = Math.sqrt(Math.pow((pX-1-tX),2) + Math.pow((pY - tY),2));
        
        // Sort possible directions by distance
        function compare(a,b) {
          if (a.distance < b.distance)
             return -1;
          if (a.distance > b.distance)
            return 1;
          return 0;
        }
        var dirs2 = dirs.sort(compare);
        
        var r = this.dir;
        var j;
        
   
     
            for (var i = dirs2.length-1; i >= 0; i--) {
                if ((dirs2[i].field != "wall") && !(dirs2[i].dir.equals(this.getOppositeDirection()))) {
                    r = dirs2[i].dir;
                    }
            		
        }
        this.directionWatcher.set(r);
        return r;
    }

    	this.getGridPosX = function() {
			return (this.posX - (this.posX % 30))/30;
		}
		this.getGridPosY = function() {
			return (this.posY - (this.posY % 30))/30;
		}


		this.getCenterX = function () {
			return this.posX+15;
		}
		this.getCenterY = function () {
			return this.posY+15;
		}


		this.dieFinal = function() {
			this.reset();
			pinky.reset();
			inky.reset();
			blinky.reset();
			clyde.reset();
		}
			this.reset = function() {
			//this.unfreeze();
			this.posX = 2*30;
			this.posY = 6*2*15;
	
		}
}
	

	game.buildWalls();

	pacman.prototype = new Figure();
	pacman1.prototype =new Figure();
	 
	
	var pacman;

	 pacman= new pacman('img/bluepac.png');


	var pacman1=new pacman1('img/red.png');
	



// Check if a new cache is available on page load.	 
function checkAppCache() {
	console.log('check AppCache');
	window.applicationCache.addEventListener('updateready', function(e) 
	{
		console.log("AppCache: updateready");
		if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {

			// Browser downloaded a new app cache.
			// Swap it in and reload the page to get the new hotness.
			window.applicationCache.swapCache();
			if (confirm('A new version of this site is available. Load it?')) {
				window.location.reload();
			}

		} else {
		// Manifest didn't change. Nothing new to server.
		}
	}, false);
	
	window.applicationCache.addEventListener('cached', function(e) 
	{
		console.log("AppCache: cached");
	}, false);
    
}

	
	// Action starts here:
	
	function hideAdressbar() {
		console.log("hide adressbar");
		$("html").scrollTop(1);
		$("body").scrollTop(1);
	}
	
	$(document).ready(function() {	
	
		$.ajaxSetup({ mimeType: "application/json" });
		
		$.ajaxSetup({beforeSend: function(xhr){
			if (xhr.overrideMimeType){
				xhr.overrideMimeType("application/json");
				//console.log("mimetype set to json");
				}
			}
		});
		
		// Hide address bar
		hideAdressbar();
		
		if (window.applicationCache != null) checkAppCache();
		

		
	
		
		$('#canvas-container').click(function() {
			if (!(game.gameOver == true))	game.pauseResume();
		});

		
		
		canvas = $("#myCanvas").get(0);
		context = canvas.getContext("2d");
        
            
 
		/* --------------- GAME INITIALISATION ------------------------------------
		
			TODO: put this into Game object and change code to accept different setups / levels
		
		-------------------------------------------------------------------------- */
		
		game.init(0);
	//	logger.disableLogger();
		
		renderContent();
		});
		
		function renderContent()
		{
			//context.save()

			// Refresh Score
			game.score.refreshblue(".score");
			game.score.refreshred(".score1");		
			// Pills
			context.beginPath();
			context.fillStyle = "White";
			context.strokeStyle = "White";
			
			var dotPosY;
			$.each(game.map.posY, function(i, item) {
				dotPosY = this.row;
			   $.each(this.posX, function() { 
				   if (this.type == "pill") {
					context.arc(game.toPixelPos(this.col-1)+15,game.toPixelPos(dotPosY-1)+15,game.pillSize,0*Math.PI,2*Math.PI);
					context.moveTo(game.toPixelPos(this.col-1), game.toPixelPos(dotPosY-1));
				   }
				 
			   }); 
			});
			
			context.fill();
			
			// Walls
			context.drawImage(canvas_walls, 0, 0);
			
			
			if (game.running == true) {
				// Ghosts
if(timervalue>0.5)
				pacman.draw(context);
				if(timervalue>1)
			pacman1.draw(context);
				inky.draw(context);
				
				pinky.draw(context);



					  if(pacman.getGridPosX()>8)
					  {

					 clyde.die();

					  }

                      else{ 
                       clyde.draw(context); 
                      }
                      if(pacman1.getGridPosX()<7)
					  {
                        blinky.die();

					  }
					  else{
                        
                        blinky.draw(context);
					  
					  }

			}


		
			
		}
		

		
		function animationLoop()
		{
			canvas.width = canvas.width;
			//renderGrid(15, "red");
			renderContent();

			if (game.pause != true){
			
				
	

				blinky.move();
				inky.move();
				pinky.move();
				clyde.move();
			if(timervalue>1)
			pacman1.move();
				if(timervalue>0)
pacman.move();
				
			}
			
			// All dots collected?
			if(timervalue>20)
			game.check();
			
			
			//requestAnimationFrame(animationLoop);
			setTimeout(animationLoop, game.refreshRate);
			
			
		}
}


geronimo();
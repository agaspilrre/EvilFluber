// Declare all the commonly used objects as variables for convenience
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
/*var b2BodyDef1 = Box2D.Dynamics.b2BodyDef;
var b2BodyDef2 = Box2D.Dynamics.b2BodyDef;
var b2BodyDef3 = Box2D.Dynamics.b2BodyDef;
var b2BodyDef4 = Box2D.Dynamics.b2BodyDef;
var b2BodyDef5 = Box2D.Dynamics.b2BodyDef;
var b2BodyDef6 = Box2D.Dynamics.b2BodyDef;*/
var b2BodyDefBullet=Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

var b2Listener = Box2D.Dynamics.b2ContactListener;

var listener = new b2Listener;


var world;
var scale = 30; //30 pixels on our canvas correspond to 1 meter in the box2d world

var positionGroundX;
var positionGroundY;
var boolR=false;
var boolL=false;

var groundBody;
var roofBody;
var wallLeftBody;
var wallRigthBody;
var player;
var playerX=300;
var playerY=300;
var groundX;
var groundY;
var ballBody;
var bulletBody;
var direccion;
var directionBullet;
var directionBall;
var bulletMove=false;
//variables para animaciones
var sx=247;
var sy=0;
var sheight=75;
var swidth=67;
//VARIABLES NUEVAS
var SCENE_1 = 1,
		SCENE_2 = 2,
		SCENE_3 = 3,
    KEY_LEFT = 37,
    KEY_RIGTH = 39,
		KEY_ENTER=13;
		KEY_SPACE=32;


var lastPress=null;
var suelo=new Image();
var techo=new Image();
var spritePlayer=new Image();
var spriteWall=new Image();
var spriteBall=new Image();
var spriteBullet=new Image();
var spriteGameOver=new Image();
var spriteWinner=new Image();
var spriteBack=new Image();
var spriteAnim=new Image();
var winn=false;
var gameOver=false;
var BodyDefBullet;
var fixtureDefBullet;
var score=10;

var stdConditions = [1, 0.5, 0.2];

var timeStep = 1/60;

//As per the Box2d manual, the suggested iteration count for Box2D is 8 for velocity and 3 for position.
var velocityIterations = 8;
var positionIterations = 3;

function reset(){

	//timeStep=0;
	player.SetLinearVelocity(new b2Vec2(0,0));
	player.SetPosition(new b2Vec2(playerX/scale, playerY/scale));

	ballBody.SetLinearVelocity(new b2Vec2(0,0));
	ballBody.SetPosition(new b2Vec2(150/scale, 50/scale));
	direccion=new b2Vec2(0,0);
	directionBullet=new b2Vec2(0,0);
	directionBall=new b2Vec2(0,0);
	directionBall.x=+1;
	createBullet();
	destroyBullet();

	//velocityIterations=0;
	//positionIterations=0;
	//timeStep=1/60;
	//positionIterations=3;
	//velocityIterations=8;

	 winn=false;
	 gameOver=false;
	 BodyDefBullet;
	 fixtureDefBullet;
	 score=10;
	 lastPress=null;
	 sx=247;
	 sy=0;
	 sheight=75;
	 swidth=67;
	 bulletMove=false;
	 playerX=300;
	 playerY=300;
	 boolR=false;
	 boolL=false;

	 //directionBall.x=0;
	 directionBall.y=0;
	 //stdConditions = [1, 0.5, 0.2];
	 //timeStep=1/60;
	 //init();

}

function init(){
	// Setup the box2d World that will do most of they physics calculation
	var gravity = new b2Vec2(0,9.8); //declare gravity as 9.8 m/s^2 downwards
	var allowSleep = false; //Allow objects that are at rest to fall asleep and be excluded from calculations
	world = new b2World(gravity,allowSleep);

	//suelo
	groundBody = createBox(b2Body.b2_staticBody, 640/2, canvas.height, 320, 10, false, stdConditions, 'muro');
	//techo
	roofBody = createBox(b2Body.b2_staticBody, 640/2, 10, 320, 10, false, stdConditions, 'muro');
	// muro derecha
	wallRigthBody = createBox(b2Body.b2_staticBody, canvas.width, canvas.height / 2, 10, 320, false, stdConditions, 'muro');
	// muro izquierda
	wallLeftBody =  createBox(b2Body.b2_staticBody, 10, 640/2, 10, 320, false, stdConditions, 'muro');

	player = createBox(b2Body.b2_dynamicBody, playerX, playerY, 30, 32, true, stdConditions, 'player');

	ballBody = createCircle(b2Body.b2_dynamicBody, 150, 50, 30, false, [1,0,1], 'ball');


	direccion=new b2Vec2(0,0);
	directionBullet=new b2Vec2(0,0);
	directionBall=new b2Vec2(0,0);
	directionBall.x=+1;
	loadImages();//funcion que carga las imagenes

	//createFloor();

	setupDebugDraw();
	animate();
	anim();
	repaint();
	enableInputs();
}

function createBox(type, x, y, w, h, rotate, conditions, customTag)
{
	var bodyDef = new b2BodyDef;
	bodyDef.type = type;
	bodyDef.position.x = x/scale;
	bodyDef.position.y = y/scale;
	bodyDef.fixedRotation = rotate;
	bodyDef.userData = {tag:customTag};
	// A fixture is used to attach a shape to a body for collision detection.
	// A fixture definition is used to create a fixture
	var fixtureDef = new b2FixtureDef;
	fixtureDef.density = conditions[0];
	fixtureDef.friction = conditions[1];
	fixtureDef.restitution = conditions[2];

	fixtureDef.shape = new b2PolygonShape;
	fixtureDef.shape.SetAsBox(w/scale, h/scale); //640 pixels wide and 20 pixels tall

	var body = world.CreateBody(bodyDef);
	var fixture = body.CreateFixture(fixtureDef);

	return body;
}

function createCircle(type, x, y, radio, rotate, conditions, customTag)
{
		var bodyDef = new b2BodyDef;
		bodyDef.type = type;
	 bodyDef.position.x = x/scale;
	 bodyDef.position.y = y/scale;
 	bodyDef.fixedRotation = rotate;
	 bodyDef.userData = {tag:customTag};

	 // A fixture is used to attach a shape to a body for collision detection.
	 // A fixture definition is used to create a fixture
	 var fixtureDef = new b2FixtureDef;
	 fixtureDef.density = conditions[0];
 	fixtureDef.friction = conditions[1];
 	fixtureDef.restitution = conditions[2];

	 fixtureDef.shape = new b2CircleShape(radio/scale);

		var body = world.CreateBody(bodyDef);
		var fixture = body.CreateFixture(fixtureDef);
		return body;
}
/*


}
*/
var context;
var context2;
function setupDebugDraw(){
	context = document.getElementById('canvas').getContext('2d');
	//contexto del segundo canvas
	context2=document.getElementById('canvas2').getContext('2d');
	var debugDraw = new b2DebugDraw();

	// Use this canvas context for drawing the debugging screen
	debugDraw.SetSprite(context);
	// Set the scale
	debugDraw.SetDrawScale(scale);
	// Fill boxes with an alpha transparency of 0.3
	debugDraw.SetFillAlpha(1);
	// Draw lines with a thickness of 1
	debugDraw.SetLineThickness(1.0);
	// Display all shapes and joints
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

	// Start using debug draw in our world
	world.SetDebugDraw(debugDraw);

	world.SetContactListener(listener);
}



function animate(){

	//console.log(ballBody.GetPosition().x);
	//console.log(wallRigthBody.GetPosition().x);
	//movimiento de la pelota
	if(!gameOver && !winn){

		world.Step(timeStep,velocityIterations,positionIterations);
		world.ClearForces();

		world.DrawDebugData();

		ballBody.ApplyForce(directionBall,ballBody.GetPosition());
		if(ballBody.GetPosition().x<2){
			//direccion a la derecha
			directionBall.x=+1;

		}
		else if(ballBody.GetPosition().x>19){
			directionBall.x=-1;
		}


		//LEFT
		if(lastPress == KEY_LEFT)
		{
			//this.bodyDef6.do_move_left = true;
			//bodyDef6.position.x-=1;
			boolL=true;
			boolR=false;
			direccion.x=-50;
			lastPress=null;

		}

		else if(lastPress==KEY_RIGTH){

			boolR=true;
			boolL=false;
			direccion.x=+50;
			lastPress=null;
		}
		player.ApplyForce(direccion, player.GetPosition());

		if(lastPress==KEY_SPACE){

			//print("HOLAAAAAAA")
			//console.log("HOLAAAAAAAAAAA");
			createBullet();
			lastPress=null;
		}
		else if(lastPress==KEY_ENTER){
			//console.log("HA ENTRADO");
			directionBall.y=-30;
			lastPress=null;
		}

		if(bulletMove){
			//console.log("LA BALA SE MUEVE");
			directionBullet.y=-10;
			bulletBody.ApplyForce(directionBullet, bulletBody.GetPosition());
			//console.log(bulletBody.GetPosition().y);
		}
		if(score<=0)
			winn=true;




	}

	else{

		if(lastPress==KEY_ENTER){
			reset();
		}
	}


	setTimeout(animate, timeStep);
}

function anim(){

	//comprobar las animaciones
	if(boolR){
		//animaciones hacia la derecha
		sy=82;
		sx+=60;
		if(sx>250){
			sx=0;
		}

	}

	else if(boolL){
		//animaciones hacia la izquierda
		sx+=60;
		if(sx>250){
			sx=0;
		}
	}

	else{
		//sin animaciones
		 sx=247;
		 sy=0;
	}




	setTimeout(anim,200);
}

//FUNCION NUEVA
function enableInputs(){
	document.addEventListener('mousemove',function(evt){
		mouseX=evt.pageX-canvas.offsetLeft;
		mouseY=evt.pageY-canvas.offsetTop;
	},false);
	canvas.addEventListener('mousedown',function(evt){
	lastPress=evt.which;
	},false);
	window.addEventListener('keydown', function(evt){lastPress = evt.which;})
	window.addEventListener('keyup',function(evt){lastPress=null;direccion.x=0;
	boolR=false;boolL=false;})
}
function destroyBullet(){
	//bulletMove=false;
	//console.log("LLAMADA A DESTRUIR");
	world.DestroyBody(bulletBody);
	 delete bulletBody;

	//bulletBody=undefined;
}

//funcion para crear la bala en el mundo fisico
function createBullet(){

	//console.log("HOLAAAAAAAAAAA");
	if(BodyDefBullet!=null){
		//destruir el objeto
		//console.log("EL OBJETO ESTA VACIANDOSE...");
		destroyBullet();

	}

	BodyDefBullet=new b2BodyDef;
	BodyDefBullet.type = b2Body.b2_dynamicBody;
	BodyDefBullet.position.x = player.GetPosition().x;
	BodyDefBullet.position.y = 380/scale;//player.GetPosition().y-100;//para que la vala se instancia encima del player
	BodyDefBullet.userData={tag:"flecha"};
	BodyDefBullet.fixedRotation = true;

	// A fixture is used to attach a shape to a body for collision detection.
	// A fixture definition is used to create a fixture
 	fixtureDefBullet = new b2FixtureDef;
	fixtureDefBullet.density = 1.0;
	fixtureDefBullet.friction = 0.5;
	fixtureDefBullet.restitution = 0.2;

	fixtureDefBullet.shape = new b2PolygonShape;
	fixtureDefBullet.shape.SetAsBox(5/scale,15/scale); //640 pixels wide and 20 pixels tall

	var body = world.CreateBody(BodyDefBullet);
	var fixture = body.CreateFixture(fixtureDefBullet);
	bulletBody = body;

	bulletMove=true;

}



listener.BeginContact = function(contact, impulse)
{
	if(contact.GetFixtureB().GetBody().GetUserData().tag === 'ball' && contact.GetFixtureA().GetBody().GetUserData().tag === 'player')
	{
		//console.log("jugador y bola chocan");
		gameOver=true;
	}

	if(contact.GetFixtureA().GetBody().GetUserData().tag === 'flecha' && contact.GetFixtureB().GetBody().GetUserData().tag === 'ball')
	{
		//console.log("la bola choca con la flecha");
		destroyBullet();
		score--;
	}

	if(contact.GetFixtureA().GetBody().GetUserData().tag === 'flecha' && contact.GetFixtureB().GetBody().GetUserData().tag === 'muro')
	{
		//console.log("la flecha choca con el techo");
		destroyBullet();
	}
}

function repaint(){


paint();
//run();
window.requestAnimationFrame(repaint);

}

function paint() {

	context2.clearRect(0,0,canvas2.width,canvas2.height);
	context2.beginPath();

	context2.fillStyle="green";
	context2.fill();
	context2.font="20px Verdana"
	context2.drawImage(spriteBack,0,0,canvas2.width,canvas2.height);
	//getposition que se obtiene se traslada al centro
	//obtener el ancho y el alto
	//y hacer los calculos de pixeles del mundo real

	//positionGroundX=bodyDef.GetPosition();

		//context2.translate(groundX,groundY);
		context2.drawImage(suelo, groundBody.GetPosition().x * scale - 320, groundBody.GetPosition().y * scale - 20, canvas2.width, 20);
		if(bulletMove){
			context2.drawImage(spriteBullet,bulletBody.GetPosition().x * scale-12,bulletBody.GetPosition().y * scale ,20,200);
		}

		context2.drawImage(spriteAnim,sx,sy,swidth,sheight,player.GetPosition().x * scale-26.5, player.GetPosition().y * scale-38.5,60,60);
		//context2.drawImage(spritePlayer,player.GetPosition().x * scale-26.5, player.GetPosition().y * scale-38.5,50,60);
		context2.drawImage(spriteWall,wallRigthBody.GetPosition().x * scale-10,wallRigthBody.GetPosition().y + scale-60,20,canvas2.height);
		context2.drawImage(spriteWall,wallLeftBody.GetPosition().x * scale-10,wallLeftBody.GetPosition().y + scale-60,20,canvas2.height);
		context2.drawImage(suelo, roofBody.GetPosition().x * scale - 320, roofBody.GetPosition().y * scale - 10, canvas2.width, 25);
		context2.drawImage(spriteBall,ballBody.GetPosition().x * scale-40,ballBody.GetPosition().y * scale -33.5,60,60);


		context2.fillText('EVILFLUBBERLIFE: '+score,40,70);

		if(gameOver)
			context2.drawImage(spriteGameOver,canvas2.width/2-40,canvas2.height/2,90,30);

		if(winn)
			context2.drawImage(spriteWinner,canvas2.width/2-40,canvas2.height/2,90,30);
}


function loadImages(){

//imagen de fondo
	suelo.src="../Resources/480p/ground.png";
	spritePlayer.src="../Resources/480p/boy-shoot.png";
	spriteWall.src="../Resources/480p/wall.png";
	spriteBall.src="../Resources/480p/ball-4.png";
	spriteBullet.src="../Resources/480p/arrow.png";
	spriteGameOver.src="../Resources/480p/game-over.png";
	spriteWinner.src="../Resources/480p/you-win.png";
	spriteBack.src="../Resources/480p/back.png";
	spriteAnim.src="../Resources/480p/panimation.png";

}

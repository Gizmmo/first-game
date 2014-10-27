//We create our only state
var playState = {

	// Here we add all the functions we need for our state
	// For this project we will just have 3 functions

	preload: function() {
		//No preloads currently needed
	},

	create: function() {

		//Create local variable
		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.cursor = game.input.keyboard.createCursorKeys();
		this.createWorld();
		this.enemies = game.add.group();
		this.enemies.enableBody = true;

		//Create the emitter with 15 particles.  We dont need to set the x and y
		//since we don't know where to do the explosion yet
		this.emitter = game.add.emitter(0, 0, 15);

		//Set the pixel image for the particles
		this.emitter.makeParticles('pixel');

		//Set the y speed of the particles between -150 and 150
		//The speed will randomly be picked between this for each particle
		this.emitter.setYSpeed(-150, 150);

		//Do the same for the x speed
		this.emitter.setXSpeed(-150, 150);

		//Use no gravity for the particles
		this.emitter.gravity = 0;

		//Create the 'right' animation of the player by looping frames 1 and 2
		this.player.animations.add('right', [1, 2], 8, true);

		//Create the 'left' animations of the player by looping frames 3 and 4
		this.player.animations.add('left', [3, 4], 8, true);

		this.jumpSound = game.add.audio('jump');
		this.coinSound = game.add.audio('coin');
		this.deadSound = game.add.audio('dead');

		//Create 10 enemies with the enemy image in the group
		//The enemies are dead by default, so they are not visible in game
		this.enemies.createMultiple(10, 'enemy');

		///Containes the time of the next enemy creation
		this.nextEnemy = 0;

		//Display the coin
		this.coin = game.add.sprite(60, 140, 'coin');

		//Add Arcade Physics to coin
		game.physics.arcade.enable(this.coin);

		//Set the anchor point of the coin to the center
		this.coin.anchor.setTo(0.5, 0.5);

		//Tell Phaser that the player will use the Arcade physics engine
		game.physics.arcade.enable(this.player);

		//Add verticle gravity to the player
		this.player.body.gravity.y = 500;

		//Display the score
		this.scoreLabel = game.add.text(30, 30, 'score: 0', {
			font: '18px Arial',
			fill: '#fffff'
		});

		game.global.score = 0;

		//Captures key buttons so that the browser does not
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT])

		this.wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D)
		}

	},

	update: function() {
		// This function is called 60 times per second 
		// It contains the game's logic

		//Tell Phaser that the player and walls should collide
		game.physics.arcade.collide(this.player, this.layer);
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

		//Make the enemies and walls collide
		game.physics.arcade.collide(this.enemies, this.layer);

		//call the playerDie function when the player and enemy overlap
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

		this.movePlayer();

		//If the nextEnemy time has passed
		if(this.nextEnemy < game.time.now) {

			//Define some variables were going to use
			var start = 4000, end = 1000, score = 100;

			//Formula to decrease the delay between enemies over time
			//at first its 4000ms then slowly reaches 1000 ms
			
			var delay = Math.max(start - (start - end) * game.global.score/score, end);
			//We Add an enemy
			this.addEnemy();

			//And we update the nextEnemy variable t have a new enemy in 2.2 seconds
			this.nextEnemy = game.time.now + delay;
		}

		if (!this.player.inWorld) {
			this.playerDie();
		}
	},

	addEnemy: function() {
		//Get the first dead enemy of the group
		var enemy = this.enemies.getFirstDead();

		//If there isnt any dead enemies, do nothing
		if (!enemy) {
			return;
		}

		//Initialize the enemy
		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.world.centerX, 0);
		enemy.body.gravity.y = 500;
		enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
		enemy.body.bounce.x = 1;
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	},

	createWorld: function() {
		//Create the tilemap
		this.map = game.add.tilemap('map');

		//Add the tileset to the map
		this.map.addTilesetImage('tileset');

		//Create the layer, by specifying the name of the tiled layer
		this.layer = this.map.createLayer('Tile Layer 1');

		//Set the world size to match the size of the layer
		this.layer.resizeWorld();

		//Enable collisions for the first element of our tileset
		this.map.setCollision(1);
	},

	movePlayer: function() {
		//If the left arrow key is pressed
		if (this.cursor.left.isDown || this.wasd.left.isDown) {
			//Move the player to the left
			this.player.body.velocity.x = -200;
			this.player.animations.play('left'); //Start the left animation
		}

		//If the right arrow is pressed
		else if (this.cursor.right.isDown || this.wasd.right.isDown) {
			//Move the player to the right
			this.player.body.velocity.x = 200;
			this.player.animations.play('right'); //Start the right animation
		}

		//If neither the right or left arrow key is pressed
		else {
			//Stop the player
			this.player.body.velocity.x = 0;
			this.player.animations.stop(); //Stop all animations
			this.player.frame = 0 //Set the splayer to fram 0, which is stand still
		}

		//If the up arrow key is pressed and the player is touching the ground
		if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.onFloor()) {
			//Move the player upward (jump)
			this.player.body.velocity.y = -320;
			this.jumpSound.play();
		}
	},

	playerDie: function() {

		if(!this.player.alive) {
			return;
		}
		//Kill the player to make it dissappear from the screen
		this.player.kill();

		//Start the sound and particles
		this.deadSound.play();
		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;

		//Start the emitter, by exploding 15 particles that will live for 600ms
		this.emitter.start(true, 600, null, 15);
		
		//Cal the startMenu function after 1000ms
		game.time.events.add(1000, this.startMenu, this);
	},

	startMenu: function() {
		game.state.start('menu');
	},

	takeCoin: function(player, coin) {
		//Player grows when grabbing a coin
		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();

		//Increase score by 5
		game.global.score += 5;

		//Update the score label
		this.scoreLabel.text = 'score: ' + game.global.score;

		//Change the coin position
		this.updateCoinPosition();

		this.coinSound.play();
	},

	updateCoinPosition: function() {
		//The coin grows into position
		this.coin.scale.setTo(0, 0);
		game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();


		var coinPosition = [{
			x: 140,
			y: 60
		}, {
			x: 360,
			y: 60
		}, {
			x: 60,
			y: 140
		}, {
			x: 440,
			y: 140
		}, {
			x: 130,
			y: 300
		}, {
			x: 370,
			y: 300
		}];

		//Remove the current coin position from the array, otherwise the coin could 
		//appear in the same position twice in a row
		for (var i = 0; i < coinPosition.length; i++) {
			if (coinPosition[i].x === this.coin.x) {
				coinPosition.splice(i, 1);
			}
		}

		//Randomly select a position from the array
		var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length - 1)];

		//Set the new position of the coin
		this.coin.reset(newPosition.x, newPosition.y);
	}

};
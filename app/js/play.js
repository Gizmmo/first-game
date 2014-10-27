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

		//Create 10 enemies with the enemy image in the group
		//The enemies are dead by default, so they are not visible in game
		this.enemies.createMultiple(10, 'enemy');

		//Call 'addEnemy every 2.2 seconds'
		game.time.events.loop(2200, this.addEnemy, this);

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
	},

	update: function() {
		// This function is called 60 times per second 
		// It contains the game's logic

		//Tell Phaser that the player and walls should collide
		game.physics.arcade.collide(this.player, this.walls);
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

		//Make the enemies and walls collide
		game.physics.arcade.collide(this.enemies, this.walls);

		//call the playerDie function when the player and enemy overlap
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

		this.movePlayer();

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
		//Create our wall group with Arcade physics
		this.walls = game.add.group();
		this.walls.enableBody = true;

		//Create the 10 walls
		game.add.sprite(0, 0, 'wallV', 0, this.walls); //Left
		game.add.sprite(480, 0, 'wallV', 0, this.walls); //Left

		game.add.sprite(0, 0, 'wallH', 0, this.walls); //Top left
		game.add.sprite(300, 0, 'wallH', 0, this.walls); //Top right
		game.add.sprite(0, 320, 'wallH', 0, this.walls); //Bottom left
		game.add.sprite(300, 320, 'wallH', 0, this.walls); //Bottom Right

		game.add.sprite(-100, 160, 'wallH', 0, this.walls); //Middle left
		game.add.sprite(400, 160, 'wallH', 0, this.walls); //Middle Right

		var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
		middleTop.scale.setTo(1.5, 1);
		var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
		middleBottom.scale.setTo(1.5, 1);

		//Set all the walls to be immovable
		this.walls.setAll('body.immovable', true);
	},

	movePlayer: function() {
		//If the left arrow key is pressed
		if (this.cursor.left.isDown) {
			//Move the player to the left
			this.player.body.velocity.x = -200;
		}

		//If the right arrow is pressed
		else if (this.cursor.right.isDown) {
			//Move the player to the right
			this.player.body.velocity.x = 200;
		}

		//If neither the right or left arrow key is pressed
		else {
			//Stop the player
			this.player.body.velocity.x = 0;
		}

		//If the up arrow key is pressed and the player is touching the ground
		if (this.cursor.up.isDown && this.player.body.touching.down) {
			//Move the player upward (jump)
			this.player.body.velocity.y = -320;
		}
	},

	playerDie: function() {
		//When  the player dies, we send the user ot the menu
		game.state.start('menu');
	},

	takeCoin: function(player, coin) {

		//Increase score by 5
		game.global.score += 5;

		//Update the score label
		this.scoreLabel.text = 'score: ' + game.global.score;

		//Change the coin position
		this.updateCoinPosition();
	},

	updateCoinPosition: function() {
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
// We initialising Phaser
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');


// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
//We create our only state
var mainState = {

	// Here we add all the functions we need for our state
	// For this project we will just have 3 functions

	preload: function() {
		// This function will be executed at the beginning 
		// That's where we load the game's assets
		
		game.load.image('player', 'assets/player.png');

	},
	create: function() {
		// This function is called after the preload function
		//  Here we set up the game, display sprites, etc.
		//  
		 
		 game.stage.backgroundColor = '#3498db';
		 game.physics.startSystem(Phaser.Physics.ARCADE);

		 //Create local variable
		 this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		 this.player.anchor.setTo(0.5, 0.5);

		 //Tell Phaser that the player will use the Arcade physics engine
		 game.physics.arcade.enable(this.player);

		 //Add verticle gravity to the player
		 this.player.body.gravity.y = 500;
	},

	update: function() {
		// This function is called 60 times per second 
		// It contains the game's logic
	},

};
// We initialising Phaser
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');


// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
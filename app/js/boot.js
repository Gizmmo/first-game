var bootState = {
	preload: function() {
		//Load the image
		game.load.image('progressBar', 'assets/progressBar.png');

	},

	create: function() {
		this.createStageBackground(); //Colors the background
		this.createPhysicsSystem(); //Sets the Physics system for the game
		this.createMobileDimensions(); //Creates Mobile dimensions if the game is on mobile platform
		this.loadNextState(); //Loads the next state
	},

	/**
	 * Creates the background color for the loading screen, and game if nothing else is changed or placed on top of the background.
	 * @return {Void} No Return Value
	 */
	createStageBackground: function() {
		//Set the background color of the stage to a light blue color
		game.stage.backgroundColor = '#3498db';
	},

	/**
	 * Creates and implements a physics system for the game
	 * @return {void} No return value
	 */
	createPhysicsSystem: function() {
		//Sets the system to the ARCADE physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
	},

	/**
	 * Creates the game with mobile friendly settings if the device being used is a mobile device
	 * @return {void} No Return Value
	 */
	createMobileDimensions: function() {
		//If the device is not a desktop, its a mobile device
		if (!game.device.desktop) {
			//Set the type of scaling to 'show all'
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

			//Add a blue color to the page to hide its white borders that may appear
			document.body.style.backgroundColor = '#3498db';

			//Set the min and max hiehgt of the game
			game.scale.minWidth = 350;
			game.scale.minHeight = 170;
			game.scale.maxWidth = 1000;
			game.scale.maxHeight = 680;

			//Center the game on screen
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;

			//Aplly the scale changed
			game.scale.setScreenSize(true);
		}
	},

	/**
	 * Loads teh next state needed to be called.  In this instance, it is the load state
	 * @return {void} No Return Value
	 */
	loadNextState: function() {
		//Start the load state
		game.state.start('load');
	}
}
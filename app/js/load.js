var loadState = {
	preload: function() {
		this.createLoadScreen(); //Creates the load screen to watch.  This must be first

		//Loads all needed Assets
		this.loadImageAssets();
		this.loadSpritesheetAssets();
		this.loadTilesetAssets();
		this.loadAudioAssets();
	},

	create: function() {
		//Go to the menu state
		game.state.start('menu');
	},

	createLoadScreen: function() {
		//Add a loading... label on the screen
		var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', {
			font: '30px Arial',
			fill: '#fffff'
		});
		loadingLabel.anchor.setTo(0.5, 0.5);

		//Display the progress bar
		var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);
	},

	loadAudioAssets: function() {
		//Sound when the player jumps
		game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);

		//Sound when the player takes a coin
		game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);

		//Sound when the player dies
		game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
	},

	loadImageAssets: function() {
		//Load the enemy Image
		game.load.image('enemy', 'assets/enemy.png');
		//Load the coin Image
		game.load.image('coin', 'assets/coin.png');
		//Load a new asset that we will use in the menu state
		game.load.image('background', 'assets/background.png');
		//Used in the particle animations of a players death
		game.load.image('pixel', 'assets/pixel.png');
	},

	loadSpritesheetAssets: function() {
		//Load player spritesheet
		game.load.spritesheet('player', 'assets/player2.png', 20, 20);

		//Load mute button spritesheet
		game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
	},

	loadTilesetAssets: function() {
		//Load Tileset objects
		game.load.image('tileset', 'assets/tileset.png');
		game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
	},


}
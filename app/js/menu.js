var menuState = {
	create: function() {
		//Add a background image
		game.add.image(0, 0, 'background');

		//Display the name of the game
		var nameLabel = game.add.text(game.world.centerX, -50, 'Super Coin Box', {
			font: '50px Arial',
			fill: '#ffffff'
		});
		nameLabel.anchor.setTo(0.5, 0.5);

		//Create a tween on the label
		var tween = game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();

		//Show the score at the center of the screen
		var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, 'score: ' + game.global.score, {
			font: '25px Arial',
			fill: '#fffff'
		})
		scoreLabel.anchor.setTo(0.5, 0.5);

		//Explain how to start the game
		var startLabel = game.add.text(game.world.centerX, game.world.height - 80, 'press the up arrow key to start', {
			font: '25px Arial',
			fill: '#ffffff'
		});
		startLabel.anchor.setTo(0.5, 0.5);

		game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 500).loop().start();

		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

		//Create a new Phaser keyboard variable: the up arrow key
		upKey.onDown.addOnce(this.start, this);

		//If bestScore is not defined it
		//means that this is the first time the game is being played
		if(!localStorage.getItem('bestScore')) {
			//Then set the best score to 0
			localStorage.setItem('bestScore', 0);
		}

		//If the score is higher then the best score
		if(game.global.score > localStorage.getItem('bestScore')) {
			//then update the best score
			localStorage.setItem('bestScore', game.global.score);
		}
	},

	start: function() {
		//Start the actual game
		game.state.start('play');
	}
}
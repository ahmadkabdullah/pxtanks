import { Config } from "./CONFIG.js";

export class Utils {
	// change cell position to pixel (3,4 = 125,175)
	static cellToPos(cell, row) {
		return [
			(cell * Config.game.cellSize) - Config.game.cellSize / 2,
			(row * Config.game.cellSize) - Config.game.cellSize / 2,
		];
	}

	// change pixel to cell position (75,25 = 2,1)
	static posToCell(x, y) {
		return [
			(x + Config.game.cellSize/2) / Config.game.cellSize,
			(y + Config.game.cellSize/2) / Config.game.cellSize,
		];
	}

	// get a random number between 0 and 9999
	static getRandomNum() {
		return Math.floor(Math.random() * 9999)
	}

}

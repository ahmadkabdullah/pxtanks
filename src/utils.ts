import { Config } from "./config";

export class Utils {
	// change cell position to pixel (3,4 = 125,175)
	static cellToPos(cellrow: number[]) {
		return [
			(cellrow[0] * Config.game.cellSize) - Config.game.cellSize / 2,
			(cellrow[1] * Config.game.cellSize) - Config.game.cellSize / 2,
		];
	}

	// change pixel to cell position (75,25 = 2,1)
	static posToCell(xy: number[]) {
		return [
			Math.floor((xy[0] + Config.game.cellSize/2) / Config.game.cellSize),
			Math.floor((xy[1] + Config.game.cellSize/2) / Config.game.cellSize),
		];
	}

	// get a random number between 0 and 9999
	static getRandomNum() {
		return Math.floor(Math.random() * 9999)
	}

}

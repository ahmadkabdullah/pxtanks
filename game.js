import { Config } from './CONFIG.js';
import { Utils } from './utils.js';

// eslint-disable-next-line no-undef
const Pixi = PIXI;

export class Game {
	constructor() {
		// runner is a pixi app
		this.runner = new Pixi.Application({
			width: Config.game.cells * Config.game.cellSize,
			height: Config.game.rows * Config.game.cellSize,
			resolution: window.devicePixelRatio || 1,
		});
		// add game unto html file
		document.body.appendChild(this.runner.view);

		// make zIndex usable
		this.runner.stage.sortableChildren = true;

		// the field contains a list of items
		// that are on the field (in the game)
		this.field = new Map();
	}

	loop(funcWithDelta) {
		this.runner.ticker.add(funcWithDelta);
	}

	// add an object to field
	addEntity(entity, cell = 1, row = 1) {
		// make sprite from texture and set on entity
		entity.setSprite(new Pixi.Sprite.from(entity.currentTexture));
		// render the sprite
		this.runner.stage.addChild(entity.sprite)

		// generate random id
		const id = Utils.getRandomNum();

		// set entity unto the field
		entity.setCellPosition(cell, row);
		this.field.set(id, entity);
		return this.field.get(id);
	}

	// a function to be run for handling all movement
	updateMoves(delta) {
		this.field.forEach((entity) => {
			// do nothing is entity is not moving
			if (entity.isMoving !== true) return;

			// move the entity towards moveTo
			this.moveEntity(entity, delta);
		});
	}

	// move entity closer to wanted pos using its speed
	moveEntity(entity, delta) {
		// where entity is and where it must
		const isAt = [entity.sprite.x, entity.sprite.y];
		const mustBeAt = entity.sprite.moveTo;

		// if destination is reached return
		if (isAt[1] === mustBeAt[1] && isAt[0] === mustBeAt[0]) {
			entity.positionCell = Utils.posToCell(isAt[0], isAt[1]);
			entity.isMoving = false;
			return;
		}

		// where the entity should move
		let nextAt = [isAt[0], isAt[1]];
		// different calculation for each direction
		switch (entity.facing) {
			case 'north':
				nextAt[1] = isAt[1] - (entity.speed + delta);
				// if there will be extra account for it
				if (nextAt[1] < mustBeAt[1]) nextAt[1] += (mustBeAt[1] - nextAt[1]);
				break;
			case 'south':
				nextAt[1] = isAt[1] + (entity.speed + delta);
				if (nextAt[1] > mustBeAt[1]) nextAt[1] -= (nextAt[1] - mustBeAt[1]);
				break;
			case 'west':
				nextAt[0] = isAt[0] - (entity.speed + delta);
				if (nextAt[0] < mustBeAt[0]) nextAt[0] += (mustBeAt[0] - nextAt[0]);
				break;
			case 'east':
				nextAt[0] = isAt[0] + (entity.speed + delta);
				if (nextAt[0] > mustBeAt[0]) nextAt[0] -= (nextAt[0] - mustBeAt[0]);
				break;
		}

		// set new position
		entity.sprite.x = nextAt[0];
		entity.sprite.y = nextAt[1];
	}
}
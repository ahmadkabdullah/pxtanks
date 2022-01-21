import { Config } from './CONFIG.js';

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
		const id = this.getRandomNum();

		// set entity unto the field
		entity.setCellPosition(cell, row);
		this.field.set(id, entity);
		return this.field.get(id);
	}

	// get a random number between 0 and 9999
	getRandomNum() {
		return Math.floor(Math.random() * 9999)
	}

	// a function to be run for handling all movement
	updateMoves(delta) {
		this.field.forEach((entity) => {
			// do nothing is entity is not moving
			if (entity.isMoving !== true) return;

			// if the entity has reached moveTo, skip it
			if (this.hasEntityReached(entity)) return;

			// move the entity towards moveTo
			this.moveEntity(entity, delta);
		});
	}

	// check to see if moveTo position was reached
	hasEntityReached(entity) {
		// if destination is reached stop moving
		if (entity.sprite.y === entity.moveTo[1] &&
			entity.sprite.x === entity.moveTo[0]) {
			entity.isMoving = false;
			return true;
		}
	}

	// move entity closer to wanted pos using its speed
	moveEntity(entity, delta) {
		switch (entity.facing) {
			case 'north': {
				const mustBeAt = entity.moveTo[1];
				let nextAt = entity.sprite.y - (entity.speed + delta);

				// if there will be extra account for it
				if (nextAt < mustBeAt) nextAt += (mustBeAt - nextAt);

				// set new position
				entity.sprite.y = nextAt;
				break;
			}

			case 'south': {
				const mustBeAt = entity.moveTo[1];
				let nextAt = entity.sprite.y + (entity.speed + delta);

				// if there will be extra account for it
				if (nextAt > mustBeAt) nextAt -= (nextAt - mustBeAt);

				// set new position
				entity.sprite.y = nextAt;
				break;
			}

			case 'west': {
				const mustBeAt = entity.moveTo[0];
				let nextAt = entity.sprite.x - (entity.speed + delta);

				// if there will be extra account for it
				if (nextAt < mustBeAt) nextAt += (mustBeAt - nextAt);

				// set new position
				entity.sprite.x = nextAt;
				break;
			}

			case 'east': {
				const mustBeAt = entity.moveTo[0];
				let nextAt = entity.sprite.x + (entity.speed + delta);

				// if there will be extra account for it
				if (nextAt > mustBeAt) nextAt -= (nextAt - mustBeAt);

				// set new position
				entity.sprite.x = nextAt;
				break;
			}
		}
	}
}
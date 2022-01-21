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

	// move entity closer to wanted pos using its speed
	moveEntity(entity, delta) {
		// where entity is and where it must
		const isAtX = entity.sprite.x, isAtY = entity.sprite.y;
		const mustBeAtX = entity.moveTo[0], mustBeAtY = entity.moveTo[1];

		// if destination is reached return
		if (isAtY === mustBeAtY && isAtX === mustBeAtX) {
			entity.isMoving = false;
			return;
		}

		// else calculate the distance to move by speed

		// where the entity should move
		let nextAtX = 0, nextAtY = 0;

		// different calculation for each direction
		switch (entity.facing) {
			case 'north':
				nextAtY = isAtY - (entity.speed + delta);
				// if there will be extra account for it
				if (nextAtY < mustBeAtY) nextAtY += (mustBeAtY - nextAtY);
				break;
			case 'south':
				nextAtY = isAtY + (entity.speed + delta);
				// if there will be extra account for it
				if (nextAtY > mustBeAtY) nextAtY -= (nextAtY - mustBeAtY);
				break;
			case 'west':
				nextAtX = isAtX - (entity.speed + delta);
				// if there will be extra account for it
				if (nextAtX < mustBeAtX) nextAtX += (mustBeAtX - nextAtX);
				break;
			case 'east':
				nextAtX = isAtX + (entity.speed + delta);
				// if there will be extra account for it
				if (nextAtX > mustBeAtX) nextAtX -= (nextAtX - mustBeAtX);
				break;
		}

		// set new position
		entity.sprite.x = nextAtX;
		entity.sprite.y = nextAtY;
	}
}
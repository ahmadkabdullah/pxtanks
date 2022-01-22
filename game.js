import { Config } from './CONFIG.js';
import { Missile } from './entity.js';
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

		// generate random id and set on entity
		const id = Utils.getRandomNum();
		entity.id = id;

		// set entity unto the field
		entity.setCellPosition(cell, row);
		this.field.set(id, entity);

		// return entity to work with
		return this.field.get(id);
	}

	// a function to be run for handling all movement
	updateMoves(delta) {
		for (let [idKey, entity] of this.field.entries()) {
			// if the entity is preparing to move, check collision
			if (entity.isMoving === 'preparing') {
				switch (this.detectCollision(entity)) {
					// if there will be collision
					case true:
						entity.isMoving = 'no';
						entity.moveToCell = entity.positionCell;
						break;
					// if there was no collision ahead
					case false:
						entity.positionCell = entity.moveToCell;
						entity.isMoving = 'moving';
						break;
				}
			}

			// move the entity if it is ready for moving
			if (entity.isMoving === 'moving') {
				// for missiles
				if (entity instanceof Missile) this.missileCollision(entity);

				// for others
				this.moveEntity(entity, delta);
			}
		}
	}

	// detect collision of moving objects
	detectCollision(entity) {
		// go through all entitites on field
		for (let [idKey, otherEntity] of this.field.entries()) {
			// skip comparison to the entity itself
			if (entity.id === otherEntity.id) continue;

			// compare with other entity's position and would-be-position
			switch (JSON.stringify(entity.moveToCell)) {
				case JSON.stringify(otherEntity.positionCell):
				case JSON.stringify(otherEntity.moveToCell):
					return true;
			}

			// compare with game borders
			if (entity.moveToCell[0] < 1 || entity.moveToCell[0] > Config.game.cells || entity.moveToCell[1] < 1 || entity.moveToCell[1] > Config.game.rows) {
				return true;
			}
		}

		return false;
	}

	// deal with collion of missiles
	missileCollision(entity) {
		for (let [idKey, otherEntity] of this.field.entries()) {
			// skip comparison to the entity itself and tank
			switch (otherEntity.id) {
				case entity.tank.id:
				case entity.id:
					continue;
			}

			console.log("COMP", entity.id, otherEntity.id);

			// compare with other entity's position and would-be-position
			if (entity.sprite.x === otherEntity.sprite.x && entity.sprite.y === otherEntity.sprite.y) {
				entity.hasHit(otherEntity);
				this.field.delete(entity.id);
				console.log("have hit", otherEntity.id);
				entity.isMoving = 'no';
				return;
			}

			// compare with game borders
			if (entity.sprite.x < 1 || entity.sprite.x > (Config.game.cellSize * Config.game.cells) || entity.sprite.y < 1 || entity.sprite.y > (Config.game.cellSize * Config.game.rows)) {
				this.field.delete(entity.id);
				console.log("hit border", otherEntity.id);
				entity.isMoving = 'no';
				return;
			}
		}
	}

	// move entity closer to wanted pos using its speed
	moveEntity(entity, delta) {
		// where entity is and where it must
		const isAt = [entity.sprite.x, entity.sprite.y];
		const mustBeAt = entity.sprite.moveTo;

		// if destination is reached stop movement
		if (isAt[1] === mustBeAt[1] && isAt[0] === mustBeAt[0]) {
			entity.isMoving = 'no';
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
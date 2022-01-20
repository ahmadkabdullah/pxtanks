import { Config } from './CONFIG.js';
import { UnMovable, Tank, Missile } from './entity.js';

// eslint-disable-next-line no-undef
const Pixi = PIXI;

export class Game {
	constructor() {
		// runner is a pixi app
		this.runner = new Pixi.Application({
			width: Config.screen.width, height: Config.screen.height,
			resolution: window.devicePixelRatio || 1,
		});
		// add game unto html file
		document.body.appendChild(this.runner.view);

		// make zIndex usable
		this.runner.stage.sortableChildren = true;

		// the field contains a list of items
		// that are on the field (in the game)
		this.field = {
			movable: new Map(),
			unMovable: new Map(),
		}
	}

	loop(funcWithDelta) {
		this.runner.ticker.add(funcWithDelta);
	}

	// add an object to field
	addEntity(entity, cell, row) {
		// make sprite from texture and set on entity
		entity.setSprite(new Pixi.Sprite.from(entity.texture));

		// render sprite
		this.runner.stage.addChild(entity.sprite)

		// generate random id
		let id = this.getRandomNum();

		// add to field and set position depending on type
		if (entity instanceof Tank) {
			this.field.movable.set(id, entity);
			entity.setPosition(...this.atCell(cell, row));
		} else if (entity instanceof Missile) {
			this.field.movable.set(id, entity);
			entity.setPosition(cell, row);
		} else if (entity instanceof UnMovable) {
			this.field.unMovable.set(id, entity);
		}

		// return as object
		return this.field.movable.get(id);
	}

	// get a random number between 0 and 9999
	getRandomNum() {
		return Math.floor(Math.random() * 9999)
	}

	// change cell position to pixel (3,4 = 125,175)
	atCell(cell, row) {
		return [
			(cell * Config.cellSize) - Config.halfCellSize,
			(row * Config.cellSize) - Config.halfCellSize,
		]
	}

	updateMoves(delta) {
		this.field.movable.forEach((entity) => {
			// do nothing is entity is not moving
			if (entity.isMoving === false) return;

			// check if in correct position
			switch (entity.facing) {
				case 'north':
				case 'south':
					if (entity.position[1] === entity.positionTo[1]) {
						entity.isMoving = false;
						return;
					}
					break;
				case 'east':
				case 'west':
					if (entity.position[0] === entity.positionTo[0]) {
						entity.isMoving = false;
						return;
					}
					break;
			}

			// move entity to positionTo using its speed

			switch (entity.facing) {
				case 'north': {
					const mustBeAt = entity.positionTo[1];
					let nextAt = entity.position[1] - (entity.speed + delta);

					// if there will be extra account for it
					if (nextAt < mustBeAt) nextAt += (mustBeAt - nextAt);

					// set new position
					entity.setPosition(entity.position[0], nextAt);
					break;
				}

				case 'south': {
					const mustBeAt = entity.positionTo[1];
					let nextAt = entity.position[1] + (entity.speed + delta);

					// if there will be extra account for it
					if (nextAt > mustBeAt) nextAt -= (nextAt - mustBeAt);

					// set new position
					entity.setPosition(entity.position[0], nextAt)
					break;
				}

				case 'west': {
					const mustBeAt = entity.positionTo[0];
					let nextAt = entity.position[0] - (entity.speed + delta);

					// if there will be extra account for it
					if (nextAt < mustBeAt) nextAt += (mustBeAt - nextAt);

					// set new position
					entity.setPosition(nextAt, entity.position[1])
					break;
				}

				case 'east': {
					const mustBeAt = entity.positionTo[0];
					let nextAt = entity.position[0] + (entity.speed + delta);

					// if there will be extra account for it
					if (nextAt > mustBeAt) nextAt -= (nextAt - mustBeAt);

					// set new position
					entity.setPosition(nextAt, entity.position[1]);
					break;
				}

				default: {
					console.log("g.loop:g.updatemoves: no direction?")
				}
			}
		});
	}
}
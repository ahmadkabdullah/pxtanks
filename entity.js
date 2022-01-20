import { Config } from "./CONFIG.js";

export class Entity {
	constructor() {
		// stores pixi sprite
		// ! Not to be accessed directly
		this.sprite = {};
		// the default texture
		// TODO expand
		this.texture = "";

		// sprite properties
		this.position = [Config.halfCellSize, Config.halfCellSize];
		this.size = [Config.cellSize, Config.cellSize];
		// direction
		this.facing = "north";

		// health and condition
		this.isDamagable = true;
		this.isDestroyed = false;
		this.health = 1;
	}

	setSprite(spriteToAdd) {
		// set sprite on entity
		this.sprite = spriteToAdd;
		this.sprite.anchor.set(0.5);
	}

	// take damage and when 0, change to destroyed
	takeDamage(damageAmount) {
		this.health -= damageAmount;
		if (this.health <= 0) this.isDestroyed = true;
	}

	// make setting the entity properties transfer to sprite
	setPosition(x, y) {
		this.position = [x, y]
		this.sprite.x = this.position[0];
		this.sprite.y = this.position[1];
	}

	setSize(w, h) {
		this.size = [w, h];
		this.sprite.width = this.size[0];
		this.sprite.height = this.size[1];
	}

	setFacing(absoluteDirection) {
		this.facing = absoluteDirection;
		switch (absoluteDirection) {
			case 'east':
				this.sprite.angle = 90;
				break;
			case 'west':
				this.sprite.angle = 270;
				break;
			case 'north':
				this.sprite.angle = 0;
				break;
			case 'south':
				this.sprite.angle = 180;
				break;
		}
	}
}

// all movable entities

class Movable extends Entity {
	constructor() {
		super();
		// movement
		this.speed = 1;
		this.isMoving = false;
		this.positionTo = [];
	}

	toMove(absoluteDirection) {
		// if already moving, don't move
		// otherwise move
		if (this.isMoving) return;
		else this.isMoving = true;

		// set to face direction to move in 
		this.setFacing(absoluteDirection);

		// set where to move
		switch (absoluteDirection) {
			case "east":
				this.positionTo = [
					this.position[0] + Config.cellSize,
					this.position[1],
				];
				break;
			case "west":
				this.positionTo = [
					this.position[0] - Config.cellSize,
					this.position[1],
				];
				break;
			case "north":
				this.positionTo = [
					this.position[0],
					this.position[1] - Config.cellSize,
				];
				break;
			case "south":
				this.positionTo = [
					this.position[0],
					this.position[1] + Config.cellSize,
				];
				break;
		}
	}
}

export class Tank extends Movable {
	constructor() {
		super();
		this.texture = Config.tanks.texture;

		// the statistics of the tank
		this.stats = {
			shots: 0,
			hits: 0,
		};

		// base tank health and speed
		this.health = Config.tanks.baseHealth;
		this.speed = Config.tanks.baseSpeed;

		// shooting of tanks
		this.missileDamage = Config.tanks.baseMissileDamage;
		this.missileSpeed = Config.tanks.baseMissileSpeed;

		// the rate of fire using status
		this.shootingRate = Config.tanks.baseShootingRate;
		this.isFiring = false;
	}

	shootMissile(game) {
		// add missile unto the game
		game.addEntity(
			new Missile(this, this.missileSpeed, this.missileDamage),
			this.position[0],
			this.position[1],
		);

		// increase shot count of tank
		this.stats.shots += 1;
	}
}

export class Missile extends Movable {
	constructor(tankThatFired, speed, damage) {
		super();
		this.texture = 'assets/missile.png';

		this.sprite.zIndex = -3;
		console.log(this.sprite.zIndex);

		// missiles have a damage property
		this.speed = speed;
		this.damage = damage;
		// who fired the missile
		this.tank = tankThatFired;
	}

	hasHit(hitEntity) {
		// cause damage
		hitEntity.takeDamage(this.damage);
		// add to tank's hit score
		this.tank.stats.hits += 1
		// destroy the sprite
		this.sprite.destroy();
	}
}

// all unmovable entities

export class UnMovable extends Entity {
	constructor() {
		super();
	}
}

export class Floor extends UnMovable {
	constructor() {
		super();

		this.isDamagable = false;
	}
}

export class Wall extends UnMovable {
	constructor() {
		super();

		this.isDamagable = true;
	}
}
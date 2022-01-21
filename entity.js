import { Config } from "./CONFIG.js";

export class Entity {
	constructor() {
		// stores pixi sprite
		// ! Not to be accessed directly
		this.sprite = {};

		// sprite properties
		this.position = [Config.screen.cellSize / 2, Config.screen.cellSize / 2];
		this.size = [Config.screen.cellSize, Config.screen.cellSize];
		// direction
		this.facing = "north";

		// health and condition
		this.isDamagable = true;
		this.isDestroyed = false;
		this.health = 1;
	}

	setTextures(normalTexture, destroyedTexture) {
		// set textures for entity from config
		this.textures = {
			normal: normalTexture,
			destroyed: destroyedTexture,
		}

		// set current texture
		this.currentTexture = this.textures.normal;
	}

	setSprite(spriteToAdd) {
		// set sprite on entity
		this.sprite = spriteToAdd;
		this.sprite.anchor.set(0.5);
	}

	// take damage and when 0, change to destroyed
	takeDamage(damageAmount) {
		this.health -= damageAmount;

		// if entity is destroyed
		if (this.health <= 0) {
			this.isDestroyed = true;
			this.currentTexture = this.textures.destroyed;
		}
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

	toMove(absoluteDirection, moveBy = Config.screen.cellSize) {
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
					this.position[0] + moveBy,
					this.position[1],
				];
				break;
			case "west":
				this.positionTo = [
					this.position[0] - moveBy,
					this.position[1],
				];
				break;
			case "north":
				this.positionTo = [
					this.position[0],
					this.position[1] - moveBy,
				];
				break;
			case "south":
				this.positionTo = [
					this.position[0],
					this.position[1] + moveBy,
				];
				break;
		}
	}
}

export class Tank extends Movable {
	constructor() {
		super();

		// textures
		this.setTextures(Config.textures.tanks.normal, Config.textures.tanks.destroyed)

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
		// if already firing, don't move, else, fire
		if (this.isFiring) return;
		else this.isFiring = true;

		// don't let tank fire more than shootingRate per second
		setTimeout((tank = this) => {
			tank.isFiring = false
		}, 100 * (10 - this.shootingRate));

		// add missile unto the game
		const missile = game.addEntity(
			new Missile(this, this.missileSpeed, this.missileDamage),
			this.position[0],
			this.position[1],
		);

		// shoot to where tank is facing
		missile.toMove(this.facing, Config.screen.cellSize * Config.screen.height * 2);

		// increase shot count of tank
		this.stats.shots += 1;
	}
}

export class Missile extends Movable {
	constructor(tankThatFired, speed, damage) {
		super();

		// textures
		this.setTextures(Config.textures.missiles.normal, Config.textures.missiles.destroyed)

		this.sprite.zIndex = -3;

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

		// textures
		this.setTextures(Config.textures.walls.normal, Config.textures.walls.destroyed)

		this.health = Config.walls.baseHealth;
		this.isDamagable = true;
	}
}
import { Config } from "./CONFIG.js";
import { Utils } from "./utils.js";

class Entity {
	constructor() {
		// stores pixi sprite
		// also position and size
		this.sprite = {};

		// position and direction
		this.positionCell = [1, 1];
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

	setCellPosition(x, y) {
		this.positionCell = [x, y]
		this.sprite.x = Utils.cellToPos(x, y)[0];
		this.sprite.y = Utils.cellToPos(x, y)[1];
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

export class Movable extends Entity {
	constructor() {
		super();
		// movement
		this.speed = 1;
		this.isMoving = false;
		// store destination in cell and pixel
		this.moveToCell = [];
	}

	move(absoluteDirection, numOfCells = 1) {
		// if already moving, don't move
		// otherwise move
		if (this.isMoving) return;
		else this.isMoving = true;

		// set default values
		this.moveToCell = [this.positionCell[0], this.positionCell[1]];

		// set where to move
		switch (absoluteDirection) {
			case "west": this.moveToCell[0] -= numOfCells; break;
			case "east": this.moveToCell[0] += numOfCells; break;
			case "north": this.moveToCell[1] -= numOfCells; break;
			case "south": this.moveToCell[1] += numOfCells; break;
		}

		// set to face direction to move in 
		this.setFacing(absoluteDirection);

		// convert to pixel
		this.sprite.moveTo = Utils.cellToPos(...this.moveToCell)
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

		// add missile unto the game right in tank cell position
		const missile = game.addEntity(
			new Missile(this, this.missileSpeed, this.missileDamage),
			this.positionCell[0],
			this.positionCell[1],
		);

		// shoot to where tank is facing
		missile.move(this.facing, Config.game.cells * 2);

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
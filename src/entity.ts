import { Texture as PTexture, Sprite as PSprite } from "pixi.js";

import { Config } from "./config";
import { Utils } from "./utils";

export class Entity {
	id: number;
	sprite: PSprite;
	positionCell: number[];
	facing: string;
	isDamagable: boolean;
	isDestroyed: boolean;
	health: number;
	textures!: { normal: any; destroyed: any; };
	currentTexture: any;

	constructor(id: number = 0) {
		// the unique id of the entity
		this.id = id;

		// stores pixi sprite
		// also pixel position and size
		this.sprite = new PSprite;

		// position and direction
		this.positionCell = [1, 1];
		this.facing = "north";

		// health and condition
		this.isDamagable = true;
		this.isDestroyed = false;
		this.health = 1;
	}

	setTextures(normalTexture: string, destroyedTexture: string) {
		// set textures for entity from config
		this.textures = {
			normal: normalTexture,
			destroyed: destroyedTexture,
		}

		// set current texture
		this.currentTexture = this.textures.normal;
	}

	setSprite(spriteToAdd: PSprite) {
		// set sprite on entity
		this.sprite = spriteToAdd;
		this.sprite.anchor.set(0.5);
	}

	// take damage and when 0, change to destroyed
	takeDamage(damageAmount: number) {
		this.health -= damageAmount;

		// if entity is destroyed
		if (this.health <= 0) {
			this.isDestroyed = true;
			this.currentTexture = this.textures.destroyed;
			this.sprite.zIndex = -9;

			// ! temporary: set new texture
			this.sprite.texture = PTexture.from(this.currentTexture);
		}
	}

	// make setting the entity properties transfer to sprite

	setCellPosition(x: number, y: number) {
		this.positionCell = [x, y]
		this.sprite.x = Utils.cellToPos([x, y])[0];
		this.sprite.y = Utils.cellToPos([x, y])[1];
	}

	setFacing(absoluteDirection: string) {
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
	speed: number;
	isMoving: boolean;
	moveToCell: number[];

	constructor() {
		super();
		// movement
		this.speed = 1;
		this.isMoving = false;
		// store destination in cell and pixel
		this.moveToCell = [];
	}

	move(absoluteDirection: string) {
		// don't move if tank is destroyed
		if (this.isDestroyed) return;

		// if already moving, don't move
		// otherwise move
		if (this.isMoving == true) return;
		else this.isMoving = true;

		// set default values
		this.moveToCell = [this.positionCell[0], this.positionCell[1]];

		// set where to move
		switch (absoluteDirection) {
			case "west": this.moveToCell[0] -= 1; break;
			case "east": this.moveToCell[0] += 1; break;
			case "north": this.moveToCell[1] -= 1; break;
			case "south": this.moveToCell[1] += 1; break;
		}

		// set to face direction to move in 
		this.setFacing(absoluteDirection);
	}
}

export class Tank extends Movable {
	stats: { shots: number; hits: number; };
	missileDamage: number;
	missileSpeed: number;
	shootingRate: number;
	isFiring: boolean;
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

	shootMissile(game: { addEntity: (arg0: Missile, arg1: number, arg2: number) => any; }) {
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
		missile.move(this.facing);

		// increase shot count of tank
		this.stats.shots += 1;
	}
}

export class Missile extends Movable {
	damage: any;
	tank: any;
	constructor(tankThatFired: Tank, speed: number, damage: number) {
		super();

		// textures
		this.setTextures(Config.textures.missiles.normal, Config.textures.missiles.destroyed)

		// missiles have a damage property
		this.speed = speed;
		this.damage = damage;
		// who fired the missile
		this.tank = tankThatFired;
		this.isDamagable = false;
	}

	hasHitBorder() {
		// destroy missile on impact
		this.sprite.destroy();
	}

	hasHit(hitEntity: Entity) {
		// destroy missile on impact
		this.sprite.destroy();

		// damage entity
		hitEntity.takeDamage(this.damage);
		// add to tank's hit score
		this.tank.stats.hits += 1
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
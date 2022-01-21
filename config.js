export const Config = {
	game: {
		cells: 14,
		rows: 14,
		cellSize: 50,
	},

	textures: {
		tanks: {
			normal: 'assets/tank.png',
			destroyed: 'assets/tankdest.png',
		},

		missiles: {
			normal: 'assets/missile.png',
		},

		walls: {
			normal: 'assets/wall.png',
		},
	},

	tanks: {
		baseHealth: 200,
		baseMissileDamage: 10,
		baseMissileSpeed: 10,
		baseShootingRate: 1,
		baseSpeed: 4,
	},

	floors: {
	},

	walls: {
		baseHealth: 100,
	},
}
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
			destroyed: 'assets/walldest.png',
		},
	},

	tanks: {
		baseHealth: 200,
		baseMissileDamage: 20,
		baseMissileSpeed: 30,
		baseShootingRate: 1,
		baseSpeed: 4,
	},

	floors: {
	},

	walls: {
		baseHealth: 100,
	},
}
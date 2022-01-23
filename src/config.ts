export const Config = {
	game: {
		cells: 14,
		rows: 14,
		cellSize: 50,
	},

	textures: {
		tanks: {
			normal: 'tank.png',
			destroyed: 'tankdest.png',
		},

		missiles: {
			normal: 'missile.png',
			destroyed: '',
		},

		walls: {
			normal: 'wall.png',
			destroyed: 'walldest.png',
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
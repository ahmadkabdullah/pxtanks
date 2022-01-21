export const Config = {
	screen: {
		cells: 14,
		rows: 14,
		cellSize: 50,
	},

	textures: {
		tanks: {
			normal: 'assets/tank.png',
		},

		missiles: {
			normal: 'assets/missile.png',
		}
	},

	tanks: {
		baseHealth: 200,
		baseMissileDamage: 10,
		baseMissileSpeed: 10,
		baseShootingRate: 10,
		baseSpeed: 4,
	},

	floors: {
	},

	walls: {
		baseHealth: 100,
	},
}
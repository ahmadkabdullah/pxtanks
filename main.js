/* eslint-disable no-unused-vars */
import { Tank } from './entity.js';
import { Game } from './game.js';

let g = new Game();

let bony1 = g.addEntity(new Tank(), 2, 8);
let bony2 = g.addEntity(new Tank(), 3, 8);
let bony3 = g.addEntity(new Tank(), 4, 8);
let bony4 = g.addEntity(new Tank(), 5, 8);
let bony6 = g.addEntity(new Tank(), 7, 8);
let bony7 = g.addEntity(new Tank(), 8, 8);
let bony8 = g.addEntity(new Tank(), 9, 8);
let bony9 = g.addEntity(new Tank(), 10, 8);

// listeners for p1
window.addEventListener('keypress', (e) => {
	switch(e.key) {
		case 'w': bony3.toMove('north'); break;
		case 's': bony3.toMove('south'); break;
		case 'a': bony3.toMove('west'); break;
		case 'd': bony3.toMove('east'); break;
	}
})
window.addEventListener('keydown', (e) => {
	if (e.key == 'v') bony3.shootMissile(g);
})

// listeners for p2
window.addEventListener('keydown', (e) => {
	switch(e.key) {
		case 'ArrowUp': bony8.toMove('north'); break;
		case 'ArrowDown': bony8.toMove('south'); break;
		case 'ArrowRight': bony8.toMove('east'); break;
		case 'ArrowLeft': bony8.toMove('west'); break;
	}
})
window.addEventListener('keydown', (e) => {
	if (e.key == 'p') bony8.shootMissile(g);
})


g.loop((delta) => {

	// handle movement
	g.updateMoves(delta);
});
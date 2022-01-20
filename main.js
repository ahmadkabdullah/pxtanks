import { Tank } from './entity.js';
import { Game } from './game.js';

let g = new Game();

let bony1 = g.addEntity(new Tank(), 2, 8);
let bony2 = g.addEntity(new Tank(), 3, 8);
let bony3 = g.addEntity(new Tank(), 4, 8);
let bony4 = g.addEntity(new Tank(), 5, 8);
let dony = g.addEntity(new Tank(), 12, 12);

window.addEventListener('keydown', (e) => {
	if (e.key == 'w') dony.toMove('north');
	if (e.key == 's') dony.toMove('south');
	if (e.key == 'd') dony.toMove('east');
	if (e.key == 'a') dony.toMove('west');
})

window.addEventListener('keydown', (e) => {
	if (e.key == 'f') dony.shootMissile(g);
})


g.loop((delta) => {

	// handle movement
	g.updateMoves(delta);
});
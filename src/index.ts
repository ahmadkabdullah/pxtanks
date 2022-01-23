import { Tank, Wall } from './entity';
import { Game } from './game';

let g = new Game();

g.addEntity(new Wall(), 3, 4);
g.addEntity(new Wall(), 4, 4);
g.addEntity(new Wall(), 5, 4);

g.addEntity(new Tank(), 2, 8);
const bony3 = g.addEntity(new Tank(), 4, 8);
g.addEntity(new Tank(), 5, 8);
const bony8 = g.addEntity(new Tank(), 9, 8);
g.addEntity(new Tank(), 10, 8);

// listeners for p1
window.addEventListener('keypress', (e) => {
	switch(e.key) {
		case 'w': bony3.move('north'); break;
		case 's': bony3.move('south'); break;
		case 'a': bony3.move('west'); break;
		case 'd': bony3.move('east'); break;
	}
})
window.addEventListener('keydown', (e) => {
	if (e.key == 'v') bony3.shootMissile(g);
})

// listeners for p2
window.addEventListener('keydown', (e) => {
	switch(e.key) {
		case 'ArrowUp': bony8.move('north'); break;
		case 'ArrowDown': bony8.move('south'); break;
		case 'ArrowRight': bony8.move('east'); break;
		case 'ArrowLeft': bony8.move('west'); break;
	}
})
window.addEventListener('keydown', (e) => {
	if (e.key == 'p') bony8.shootMissile(g);
})


g.runner.ticker.add((delta) => {

	// handle movement
	g.updateMoves(delta);
});
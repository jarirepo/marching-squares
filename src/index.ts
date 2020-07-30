import Stats from 'stats.js';
import { Grid } from './grid';

const stats = new Stats();
stats.showPanel( 0 ); // fps
stats.dom.style.position = 'relative';

document.querySelector('#stats').appendChild(stats.dom);
const canvas = document.getElementById('scene') as HTMLCanvasElement;
const context = canvas.getContext('2d');

// const grid = new Grid({
// 	gridSizeX: 40,
// 	gridSizeY: 35,
// 	cellSize: 16
// });

// const grid = new Grid({
// 	gridSizeX: 20,
// 	gridSizeY: 15,
// 	cellSize: 32
// });

const grid = new Grid({
	gridSizeX: 4,
	gridSizeY: 3,
	cellSize: 160
});

const alpha = .5;	// iso-value

function animate(time = 0) {
	stats.begin();
	grid.show(context);
	stats.end();
	requestAnimationFrame(animate);
}

animate();

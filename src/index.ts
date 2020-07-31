import Stats from 'stats.js';
import { Grid } from './grid';
import { MarchingSquares } from './marching-squares';

const stats = new Stats();
stats.showPanel( 0 ); // fps
stats.dom.style.position = 'relative';

document.querySelector('#stats').appendChild(stats.dom);
const canvas = document.getElementById('scene') as HTMLCanvasElement;
const context = canvas.getContext('2d');

// const grid = new Grid({
// 	gridSizeX: 4,
// 	gridSizeY: 3,
// 	cellSize: 160,
// 	randomize: true
// });

const grid = new Grid({
	gridSizeX: 20,
	gridSizeY: 15,
	cellSize: 32,
	displacement: .333,
	randomize: true,
	// randomizer: (i: number, j: number) => 2 * Math.sqrt(Math.pow((i - 7.5) / 15, 2) + Math.pow((j - 10) / 20, 2))
	randomizer: (i: number, j: number) => (i > 0 && i < 15 && j > 0 && j < 20) ? Math.random() : 0
});

// const grid = new Grid({
// 	gridSizeX: 40,
// 	gridSizeY: 30,
// 	cellSize: 16,
// 	randomize: false,
// 	randomizer: (i: number, j: number) => 2 * Math.sqrt(Math.pow((i - 15) / 30, 2) + Math.pow((j - 20) / 40, 2))
// });

const ms = new MarchingSquares(grid, { isoValue: .5 });

function animate(time = 0) {
	stats.begin();
	context.fillStyle = '#fff';
	context.fillRect(0, 0, canvas.width, canvas.height);
	ms.opts.isoValue = .5 *  (Math.sin(2 * Math.PI / 1e4 * time) + 1);
	ms.update();
	grid.show(context);
	ms.show(context);
	stats.end();
	requestAnimationFrame(animate);
}

animate();

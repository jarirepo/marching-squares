import { Vertex } from './vertex';

export interface GridOptions {
	gridSizeX: number;
	gridSizeY: number;
	cellSize: number;
	randomize: boolean,
	randomizer?: (i: number, j: number) => number
}

export class Grid {
	vertices: Vertex[];

	constructor(readonly opts: GridOptions) {
		this.vertices = [];
		const vertexCount = (opts.gridSizeX + 1) * (opts.gridSizeY + 1);
		const cellCount = opts.gridSizeX * opts.gridSizeY;
		let x = 0;
		let y = 0;

		// let rng = (i: number, j: number) => (i > 0 && i < this.opts.gridSizeY && j > 0 && j < this.opts.gridSizeX) ? Math.random() : 0;
		let rng = (i: number, j: number) => Math.random();
		if (this.opts.randomizer) {
			rng = this.opts.randomizer;
		}

		for (let i = 0; i <= this.opts.gridSizeY; i++) {
			x = 0;
			for (let j = 0; j <= this.opts.gridSizeX; j++) {
				const value = rng(i, j);
				this.vertices.push(new Vertex(x, y, value));
				x += this.opts.cellSize;
			}
			y += this.opts.cellSize;
		}

		// Randomly move the inner vertices
		if (this.opts.randomize) {
			for (let i = 1; i < this.opts.gridSizeY; i++) {
				for (let j = 1; j < this.opts.gridSizeX; j++) {
					const index = j + i * (this.opts.gridSizeX + 1);
					const rx = 2 * Math.random() - 1;
					const ry = 2 * Math.random() - 1;
					this.vertices[index].x += .5 * rx * this.opts.cellSize;
					this.vertices[index].y += .5 * ry * this.opts.cellSize;
				}
			}
		}
		// console.log(this.vertices);
	}

	public show(context: CanvasRenderingContext2D): void {
		// Draw grid edges
		context.strokeStyle = '#f0f0f0';
		context.lineWidth = 1;

		for (let i = 0; i < this.opts.gridSizeY; i++) {
			for (let j = 0; j < this.opts.gridSizeX; j++) {
				const a = j + i * (this.opts.gridSizeX + 1);
				const b = a + 1;
				const c = j + 1 + (i + 1) * (this.opts.gridSizeX + 1);
				const d = c - 1;
				context.beginPath();
				context.moveTo(10 + this.vertices[a].x, 490 - this.vertices[a].y);
				context.lineTo(10 + this.vertices[b].x, 490 - this.vertices[b].y);
				context.lineTo(10 + this.vertices[c].x, 490 - this.vertices[c].y);
				context.lineTo(10 + this.vertices[d].x, 490 - this.vertices[d].y);
				context.lineTo(10 + this.vertices[a].x, 490 - this.vertices[a].y);
				context.stroke();
			}
		}

		// Draw vertices
		context.fillStyle = '#333';
		
		for (let i = 0; i <= this.opts.gridSizeY; i++) {
			for (let j = 0; j <= this.opts.gridSizeX; j++) {
				const index = j + i * (this.opts.gridSizeX + 1);
				context.beginPath();
				context.arc(10 + this.vertices[index].x, 490 - this.vertices[index].y, 1, 0, 2 * Math.PI);
				context.fill();
				const s = (this.vertices[index].sign < 0) ? '-' : '+';
				context.font = '18px Sans Serif'
				context.fillText(s, 10 + this.vertices[index].x, 490 - this.vertices[index].y);
			}
		}
	}
}

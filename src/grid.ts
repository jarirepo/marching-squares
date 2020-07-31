import { Vertex } from './vertex';
import { Edge } from './edge';
import { Cell } from './cell';

export interface GridOptions {
	gridSizeX: number;
	gridSizeY: number;
	cellSize: number;
	/** Random displacement, given as a fraction of the cell size */
	displacement?: number;
	randomize?: boolean,
	randomizer?: (i: number, j: number) => number
}

export class Grid {

	vertices: Vertex[];
	edges: Edge[];
	cells: Cell[];

	constructor(readonly opts: GridOptions) {
		// Create vertices
		this.vertices = [];
		// const vertexCount = (opts.gridSizeX + 1) * (opts.gridSizeY + 1);
		// const cellCount = opts.gridSizeX * opts.gridSizeY;

		let x = 0;
		let y = 0;

		let rng: (i: number, j: number) => number;
		if (this.opts.randomizer) {
			rng = this.opts.randomizer;
		} else {
			// rng = (i: number, j: number) => Math.random();		
			rng = (i: number, j: number) => (i > 0 && i < this.opts.gridSizeY && j > 0 && j < this.opts.gridSizeX) ? Math.random() : 0;
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

		// Create edges and cells
		this.edges = [];
		this.cells = [];

		let left: Edge;
		let right: Edge;
		let bottom: Edge;
		let top: Edge;

		for (let i = 0; i < this.opts.gridSizeY; i++) {
			for (let j = 0; j < this.opts.gridSizeX; j++) {
				const a = j + i * (this.opts.gridSizeX + 1);
				const b = a + 1;
				const c = j + 1 + (i + 1) * (this.opts.gridSizeX + 1);
				const d = c - 1;

				const vertices: Vertex[] = [
					this.vertices[a],
					this.vertices[b],
					this.vertices[c],
					this.vertices[d]
				];

				if (i === 0) {
					bottom = new Edge(this.vertices[a], this.vertices[b]);
					this.edges.push(bottom);
				} else {
					const index = j + (i - 1) * this.opts.gridSizeX;
					bottom = this.cells[index].edges[2].swap();
				}

				if (j === 0) {
					left = new Edge(this.vertices[d], this.vertices[a]);
					this.edges.push(left);
				} else {
					const index = j - 1 + i * this.opts.gridSizeX;
					left = this.cells[index].edges[1].swap();
				}

				right = new Edge(this.vertices[b], this.vertices[c]);
				top = new Edge(this.vertices[c], this.vertices[d]);

				this.edges.push(right);
				this.edges.push(top);

				this.cells.push(new Cell(vertices, [bottom, right, top, left]));
			}
		}

		if (this.opts.randomize) {
			this.randomizeInnerVertices(this.opts.displacement || 0);
		}

		// console.log(this.vertices);
		// console.log(this.edges);
		// console.log(this.cells);
	}

	public randomizeInnerVertices(d: number): void {
		if (d !== 0) {
			for (let i = 1; i < this.opts.gridSizeY; i++) {
				for (let j = 1; j < this.opts.gridSizeX; j++) {
					const index = j + i * (this.opts.gridSizeX + 1);
					const dx = d * this.opts.cellSize * (2 * Math.random() - 1);
					const dy = d * this.opts.cellSize * (2 * Math.random() - 1);
					this.vertices[index].x += dx;
					this.vertices[index].y += dy;
				}
			}
		}
	}

	public show(context: CanvasRenderingContext2D): void {
		// Draw edges
		context.strokeStyle = '#f0f0f0';
		context.lineWidth = 1;

		// for (let i = 0; i < this.opts.gridSizeY; i++) {
		// 	for (let j = 0; j < this.opts.gridSizeX; j++) {
		// 		const a = j + i * (this.opts.gridSizeX + 1);
		// 		const b = a + 1;
		// 		const c = j + 1 + (i + 1) * (this.opts.gridSizeX + 1);
		// 		const d = c - 1;
		// 		context.beginPath();
		// 		context.moveTo(10 + this.vertices[a].x, 490 - this.vertices[a].y);
		// 		context.lineTo(10 + this.vertices[b].x, 490 - this.vertices[b].y);
		// 		context.lineTo(10 + this.vertices[c].x, 490 - this.vertices[c].y);
		// 		context.lineTo(10 + this.vertices[d].x, 490 - this.vertices[d].y);
		// 		context.lineTo(10 + this.vertices[a].x, 490 - this.vertices[a].y);
		// 		context.stroke();
		// 	}
		// }
		for (const edge of this.edges) {
			context.beginPath();
			context.moveTo(10 + edge.p0.x, 490 - edge.p0.y);
			context.lineTo(10 + edge.p1.x, 490 - edge.p1.y);
			context.stroke();
		}

		// Draw vertices
		// return;
		context.fillStyle = '#333';
		context.font = '18px Sans Serif'
		
		for (let i = 0; i <= this.opts.gridSizeY; i++) {
			for (let j = 0; j <= this.opts.gridSizeX; j++) {
				const index = j + i * (this.opts.gridSizeX + 1);
				context.beginPath();
				context.arc(10 + this.vertices[index].x - .5, 490 - this.vertices[index].y - .5, 1, 0, 2 * Math.PI);
				context.fill();

				// const s = (this.vertices[index].sign < 0) ? '-' : '+';
				// context.beginPath();
				// context.fillText(s, 10 + this.vertices[index].x, 490 - this.vertices[index].y);
			}
		}
	}

	public addBulge(nx: number, ny: number, r: number): void {
		yLoop: for (let i = -r; i <= r; i++) {
			const m = ny + i;
			if (m < 0 || m > this.opts.gridSizeY)
				continue yLoop;
			xLoop: for (let j = -r; j <= r; j++) {
				const n = nx + j;
				if (n < 0 || n > this.opts.gridSizeX)
					continue xLoop;
				const d = Math.sqrt(i * i + j * j);
				if (d <= r) {
					const val = 1 - d / r;
					const index = n + m * (this.opts.gridSizeX + 1);
					this.vertices[index].value += val;
				}
			}
		}
	}

	public addIndent(): void {
	}
}

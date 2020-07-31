import { Grid } from './grid';
import { Vertex } from './vertex';

interface MarchingSquaresOptions {
	isoValue: number;
}

export class MarchingSquares {

	contours: Vertex[][] = [];

	constructor(readonly grid: Grid, readonly opts: MarchingSquaresOptions) {
	}

	update(): void {
		// const weights = [8, 4, 2, 1];

		// Evaluate the vertices
		this.grid.vertices.forEach(v => v.evaluate(this.opts.isoValue));

		// Interpolate the edges
		this.grid.edges.forEach(e => e.interpolate(this.opts.isoValue));

		// Generate contour lines
		this.contours = [];
		for (const cell of this.grid.cells) {
			switch (cell.code) {
				case 1:
				case 14:					
					this.contours.push([cell.edges[2].q, cell.edges[3].q])
					break;
				case 2:
				case 13:
					this.contours.push([cell.edges[1].q, cell.edges[2].q])
					break;
				case 3:
				case 12:
					this.contours.push([cell.edges[1].q, cell.edges[3].q])
					break;
				case 4:
				case 11:
					this.contours.push([cell.edges[0].q, cell.edges[1].q])
					break;
				case 5:
					this.contours.push([cell.edges[0].q, cell.edges[1].q])
					this.contours.push([cell.edges[2].q, cell.edges[3].q])
					break;
				case 10:
					this.contours.push([cell.edges[0].q, cell.edges[3].q])
					this.contours.push([cell.edges[1].q, cell.edges[2].q])
					break;
				case 6:
				case 9:
					this.contours.push([cell.edges[0].q, cell.edges[2].q])
					break;
				case 7:
				case 8:
					this.contours.push([cell.edges[0].q, cell.edges[3].q])
					break;
			}
		}

		// console.log('Contours:', this.contours);
	}

	public show(context: CanvasRenderingContext2D): void {
		// Draw contour lines
		context.strokeStyle = '#006699';
		context.lineWidth = 1;
		context.beginPath();
		for (const c of this.contours) {
			context.moveTo(10 + c[0].x, 490 - c[0].y);
			for (let i = 1; i < c.length; i++) {
				context.lineTo(10 + c[i].x, 490 - c[i].y);
			}
		}
		context.stroke();
	}
}

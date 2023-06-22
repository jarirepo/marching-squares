import { Grid } from "./grid";
import { Vertex } from "./vertex";

interface MarchingSquaresOptions {
	isoValue: number;
}

/** Mapping from cell code 0-15 to contour edges indices */
const cell2edge: number[][][] = [
	[],
	[[2, 3]],
	[[1, 2]],
	[[1, 3]],
	[[0, 1]],
	[
		[0, 1],
		[2, 3],
	],
	[[0, 2]],
	[[0, 3]],
	[[0, 3]],
	[[0, 2]],
	[
		[0, 3],
		[1, 2],
	],
	[[0, 1]],
	[[1, 3]],
	[[1, 2]],
	[[2, 3]],
	[],
];

export class MarchingSquares {
	contours: Vertex[][] = [];

	constructor(readonly grid: Grid, readonly opts: MarchingSquaresOptions) {}

	update(): void {
		// Evaluate the vertices
		this.grid.vertices.forEach((v) => v.evaluate(this.opts.isoValue));
		// Interpolate the edges
		this.grid.edges.forEach((e) => e.interpolate(this.opts.isoValue));
		// Generate contour lines
		this.contours = [];
		for (const cell of this.grid.cells) {
			this.contours.push(
				...cell2edge[cell.code].map((v) => v.map((i) => cell.edges[i].q))
			);
		}
	}

	public show(context: CanvasRenderingContext2D): void {
		// Draw contour lines
		context.strokeStyle = "#006699";
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

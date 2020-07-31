import { Vertex } from './vertex';
import { Edge } from './edge';

const W = [8, 4, 2, 1];

export class Cell {

	constructor(readonly vertices: Vertex[], readonly edges: Edge[]) { }

	get code(): number {
		return this.vertices
			.map(v => (v.sign <= 0) ? 0 : 1).reduce((s, v, i) => s + v * W[i], 0);
	}
}

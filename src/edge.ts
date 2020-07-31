import { Vertex } from "./vertex";

export class Edge {

	q: Vertex;

	constructor(public p0: Vertex, public p1: Vertex) { }

	public interpolate(value: number): Vertex {
		if (this.p0.sign === this.p1.sign) {
			this.q = null;
		} else {
			const gradient = (value - this.p0.value) / (this.p1.value - this.p0.value);
			this.q = new Vertex(
				this.p0.x + gradient * (this.p1.x - this.p0.x),
				this.p0.y + gradient * (this.p1.y - this.p0.y)
			);
		}
		return this.q;
	}
}

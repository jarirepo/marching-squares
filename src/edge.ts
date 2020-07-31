import { Vertex } from "./vertex";

export class Edge {

	q: Vertex;

	constructor(public p0: Vertex, public p1: Vertex) { }

	public interpolate(value: number): Vertex {
		if (this.p0.sign === this.p1.sign) {
			this.q = null;
		} else {
			this.q = new Vertex(
				this.p0.x + (value - this.p0.value) * (this.p1.x - this.p0.x) / (this.p1.value - this.p0.value),
				this.p0.y + (value - this.p0.value) * (this.p1.y - this.p0.y) / (this.p1.value - this.p0.value)
			);
		}
		return this.q;
	}

	public swap(): Edge {
		const temp = this.p0;
		this.p0 = this.p1;
		this.p1 = temp;
		return this;
	}
}

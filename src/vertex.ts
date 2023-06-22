export class Vertex {
	constructor(
		public x: number,
		public y: number,
		public value = 0,
		private _sign = 0
	) {}

	public evaluate(level: number): void {
		this._sign = Math.sign(this.value - level);
	}

	public get sign() {
		return this._sign;
	}
}

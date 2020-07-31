export class Vertex {

	private _sign: number;

	constructor(public x: number, public y: number, public value = 0) { }

	public evaluate(level: number): void {
		this._sign = Math.sign(this.value - level);
	}

	public get sign(): number {
		return this._sign;
	}
}

export {}

declare global {
	interface String {
		toNumber():number;
	}
}

String.prototype.toNumber = function():number
{
	return Number(this);
}
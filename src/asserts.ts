export function ASSERT_ONLY_ASCII_ALLOWED(value: number) {
	console.assert(value >= 0 && value<= 127, `Character ${String.fromCharCode(value)} with code ${value} is not an ASCII character. Only ASCII characters are supported`);
}

export function ERROR_CONTEXT_NOT_FOUND() {
	console.error("Failed to get 2d context from canvas");
}
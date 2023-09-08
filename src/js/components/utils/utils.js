export function debounce(f, t) {
	return function (args) {
	  let previousCall = this.lastCall;
	  this.lastCall = Date.now();
	  if (previousCall && ((this.lastCall - previousCall) <= t)) {
		clearTimeout(this.lastCallTimer);
	  }
	  this.lastCallTimer = setTimeout(() => f(args), t);
	}
}

export function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
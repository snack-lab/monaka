import { slowDown } from 'express-slow-down';

const speedLimiter = slowDown({
	windowMs: 15 * 60 * 1000,
	delayAfter: 5,
	delayMs: (hits) => hits * 100,
});

export default speedLimiter;

import dotenv from 'dotenv';
import express, { Express, Response, Request } from 'express';
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';
import { slowDown } from 'express-slow-down';
import cors from 'cors';
import helmet from 'helmet';
import { isEmpty, isNaN, parseInt } from 'lodash';

dotenv.config();

const parseEnvStringToNumber = (envVariable: string | undefined): number => {
    if(isEmpty(envVariable)) {
        throw new Error(`Invalid input.`)
    }
    const parsedVariable: number = parseInt(envVariable as string)
    if(isNaN(parsedVariable)) {
        throw new Error(`Invalid input.`)
    }

    return parsedVariable;
}

const app: Express = express()
const PORT: string = process.env.PORT || "3001";
const rateLimitDuration: number = parseEnvStringToNumber(process.env.RATE_LIMIT_DURATION_IN_MINS);
const speedLimitDuration: number = parseEnvStringToNumber(process.env.RATE_SPEED_LIMIT_DURATION_IN_MINS);

const rateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: rateLimitDuration * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
})

const speedLimiter: RateLimitRequestHandler = slowDown({
    windowMs: speedLimitDuration * 60 * 1000,
    delayAfter: 15,
    delayMs: (hits: number): number => hits * 100
})

app.use(cors())
app.use(helmet())
app.use(rateLimiter)
app.use(speedLimiter)

app.get("/", (_: Request, res: Response<{ message: string }>): void => {
    res.status(200).json({
        message: "hello"
    }).end();
})

app.listen(PORT, () => {
    console.log(`[SERVER] listening on http://localhost:${PORT}`)
})

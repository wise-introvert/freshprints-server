export {}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            RATE_LIMIT_DURATION_IN_MINS: string;
            RATE_SPEED_LIMIT_DURATION_IN_MINS: string;
        }
    }
}

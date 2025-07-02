declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_USER: string;
    DB_PASS: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_CA: string;
    SESSION_SECRET: string;
    JWT_SECRET: string;
    ACCESS_SECRET: string;
    REFRESH_SECRET: string;
    SERVER_URL: string;
    CLIENT_URL: string;
  }
}
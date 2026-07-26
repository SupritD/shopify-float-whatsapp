import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient;
}

function createPrismaClient() {
  const dbUrl = new URL(process.env.DATABASE_URL as string);

  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: dbUrl.port ? Number(dbUrl.port) : 3306,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, ""),
    connectionLimit: 5,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    // Must stay below the MySQL server's wait_timeout so the pool never
    // hands out a connection the server has already dropped.
    idleTimeout: 60,
    leakDetectionTimeout: 15000,
  });

  return new PrismaClient({ adapter });
}

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = createPrismaClient();
  }
}

const prisma = global.prismaGlobal ?? createPrismaClient();

export default prisma;

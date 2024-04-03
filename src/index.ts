import Fastify from "fastify"
import redis from "@fastify/redis"
import mongodb from "@fastify/mongodb"
import router from "./routes"

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
      },
    },
  },
  production: true,
  test: false,
}

const fastify = Fastify({
  logger: envToLogger[process.env.PRODUCTION ? "production" : "development"] ?? true,
})

fastify.register(redis, {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT as unknown as number,
  password: process.env.REDIS_PASS,
  closeClient: true,
})

fastify.register(mongodb, {
  url: process.env.MONGO_URL,
  forceClose: true,
})

fastify.register(router)

fastify.listen({
  port: 3000,
})

import Fastify, { type FastifyRequest } from "fastify"
import redis from "@fastify/redis"
import mongodb from "@fastify/mongodb"
import type { DashboardDocument } from "./types"

const fastify = Fastify({
  logger: true
})

fastify.register(redis, {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT as unknown as number,
  password: process.env.REDIS_PASS,
  closeClient: true
})

fastify.register(mongodb, {
  url: process.env.MONGO_URL,
  forceClose: true
})

fastify.post("/updateServers", async (req: FastifyRequest<{ Body: string[] | unknown }>, res) => {
  if (!Array.isArray(req.body) || (req.body.length == 1 && typeof req.body[0] == typeof "")) {
    res.status(400)
    return { message: "Invalid body." }
  }

  if (!req.headers.authorization?.startsWith("Basic")) {
    res.status(400)
    return { message: "Authorization method not supported." }
  }

  const authHeader = req.headers.authorization.split(" ")[1]
  if (!authHeader) {
    res.status(401)
    return { message: "Authorization header not provided." }
  }

  const [botId, authKey] = Buffer.from(authHeader, "base64").toString().split(":")
  if (!botId || !authKey) {
    res.status(401)
    return { message: "Bot ID or authorization key unspecified." }
  }

  const botData = await fastify.mongo.client
    .db("dashio")
    .collection<DashboardDocument>("dashboards")
    .findOne({ _id: botId })

  if (!botData || authKey !== botData.auth_key) {
    res.status(401)
    return { message: "Invalid bot ID or authorization key." }
  }

  fastify.redis.sadd(botId, req.body)
  return { message: "OK" }
})


fastify.listen({
  port: 3000
})
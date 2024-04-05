import type { FastifyRequest, FastifyInstance, FastifyReply } from "fastify"
import { randomBytes } from "node:crypto"
import type { DashboardDocument } from "../../types"

export default async function insertDashboardEndpoint(
  req: FastifyRequest<{ Body: DashboardDocument }>,
  res: FastifyReply,
  fastify: FastifyInstance
) {
  if (!req.headers.authorization || req.headers.authorization?.split(" ")[1] != process.env.FRONT_SECRET) {
    res.status(401)
    return { message: "Incorrect authorization key." }
  }
  const mongo = fastify.mongo.client
    .db("dashio")
    .collection<DashboardDocument>("dashboards")

  if (await mongo.findOne({ _id: req.body._id })) {
    res.status(400)
    return { message: "Bot dashboard already exists." }
  }
  const r = randomBytes(20).toString("hex")

  await mongo.insertOne({
    _id: req.body._id,
    display_name: req.body.display_name,
    data: "{}",
    auth_key: r,
    premium: false,
    owner_id: req.body.owner_id
  })

  return {
    message: "OK",
    data: {
      auth_key: r
    }
  }
}
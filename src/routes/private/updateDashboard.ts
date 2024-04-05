import type { FastifyRequest, FastifyInstance, FastifyReply } from "fastify"
import type { DashboardDocument } from "../../types"
import type { UpdateDashboardBody } from "../../types"

export default async function updateDashboardEndpoint(
  req: FastifyRequest<{ Body: UpdateDashboardBody }>,
  res: FastifyReply,
  fastify: FastifyInstance
) {
  if (!req.headers.authorization || req.headers.authorization?.split(" ")[1] != process.env.FRONT_SECRET) {
    res.status(401)
    return { message: "Incorrect authorization key." }
  }

  const dash = await fastify.mongo.client
    .db("dashio")
    .collection<DashboardDocument>("dashboards")
    .updateOne(
      { _id: req.body.id },
      {
        "$set": {
          data: JSON.stringify(req.body.data),
        }
      }
    )

  if (!dash) return { message: "Could not find specified record." }

  return {
    message: "OK"
  }
}
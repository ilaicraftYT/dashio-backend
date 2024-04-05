import type { FastifyRequest, FastifyInstance } from "fastify"
import updateServersEndpoint from "./updateServers"
import type { DashboardDocument, UpdateDashboardBody } from "../types"
import updateDashboardEndpoint from "./private/updateDashboard"
import insertDashboardEndpoint from "./private/insertDashboard"

export default (
  fastify: FastifyInstance,
  _opts: unknown,
  done: (err?: Error) => void
) => {
  fastify.post("/updateServers", async (req: FastifyRequest<{ Body: string[] | unknown }>, res) => {
    return await updateServersEndpoint(req, res, fastify)
  })

  fastify.post("/priv/updateDashboard", async (req: FastifyRequest<{ Body: UpdateDashboardBody }>, res) => {
    return await updateDashboardEndpoint(req, res, fastify)
  })

  fastify.put("/priv/insertDashboard", async (req: FastifyRequest<{ Body: DashboardDocument }>, res) => {
    return await insertDashboardEndpoint(req, res, fastify)
  })

  done()
}

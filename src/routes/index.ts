import type { FastifyRequest, FastifyInstance } from "fastify"
import updateServersEndpoint from "./updateServers"
import type { UpdateDashboardBody } from "../types"
import updateDashboardEndpoint from "./private/updateDashboard"

export default (
  fastify: FastifyInstance,
  _opts: unknown,
  done: (err?: Error) => void
) => {
  fastify.post("/updateServers", async (req: FastifyRequest<{ Body: string[] | unknown }>, res) =>
    await updateServersEndpoint(req, res, fastify)
  )

  fastify.post("/priv/updateDashboard", async (req: FastifyRequest<{ Body: UpdateDashboardBody }>, res) => {
    await updateDashboardEndpoint(req, res, fastify)
  })
  done()
}

import db from "@/lib/db"
import { ObjectId } from "mongodb"
import type { APIRoute } from "astro"


export const prerender = false

export const GET: APIRoute = async ({ requesti, params }) => {
    const { id } = params
    const order = await db.onepay.findOne({ _id: new ObjectId(id) })

    if (order?.status === "paid") {
        return Response.json({ status: true, redirectUrl: order.redirectUrl })
    }

    return Response.json({ status: false })
}
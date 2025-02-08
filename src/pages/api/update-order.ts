import db from "@/lib/db"
import type { APIRoute } from "astro"
import _ from "lodash"
import { ObjectId } from "mongodb"

export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
    const body = await request.json()
    let { id } = body
    id = new ObjectId(id)
    let order = await db.onepay.findOne({ _id: id })
    if (!order) {
        return Response.json({ success: false, message: "订单不存在" })
    }

    let updateFields = _.pick(body, order.fields)
    console.log(updateFields)
    await db.onepay.updateOne({ _id: id }, { $set: updateFields })
    return Response.json({ success: true })
}

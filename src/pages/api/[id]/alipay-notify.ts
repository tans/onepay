import type { APIRoute } from "astro"
import db from "@/lib/db"
import { ObjectId } from "mongodb"
export const prerender = false;


export const POST: APIRoute = async ({ request, params }) => {
    const formData = await request.formData()
    const form = Object.fromEntries(formData)
    console.log(form)

    let order = await db.onepay.findOne({ _id: new ObjectId(params.id) })
    if (!order) {
        return Response.json({ success: false, message: "订单不存在" })
    }

    if (order.status === 'paid') {
        return Response.json({ success: false, message: "订单已支付" })
    }

    await db.onepay.updateOne({ _id: order._id }, { $set: { status: 'paid' } })

    return Response.json({ success: true })
}

import type { APIRoute } from "astro"
import db from "@/lib/db"
import { ObjectId } from "mongodb"
export const prerender = false;
export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url)
    const params = url.searchParams
    console.log(params)

    let order = await db.onepay.findOne({ _id: new ObjectId(params.get('out_trade_no')) })
    if (!order) {
        return Response.json({ success: false, message: "订单不存在" })
    }

    if (order.status === 'paid') {
        return Response.json({ success: false, message: "订单已支付" })
    }

    await db.onepay.updateOne({ _id: order._id }, { $set: { status: 'paid' } })

    return Response.json({ success: true })
}
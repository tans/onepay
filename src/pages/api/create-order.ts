import db from "@/lib/db"
import type { APIRoute } from "astro"

export const prerender = false;
let createOrder = async ({ fee, outTradeNo, redirectUrl, fields }: { fee: number, outTradeNo: string, redirectUrl: string, fields: any }) => {
    let order = await db.onepay.findOne({
        outTradeNo
    })
    if (order) {
        return order
    }

    const { insertedId } = await db.onepay.insertOne({
        fee,
        outTradeNo,
        redirectUrl,
        fields,
        createdAt: new Date()
    })
    order = await db.onepay.findOne({ _id: insertedId })
    return order
}

export const GET: APIRoute = async ({ request }) => {

    const { searchParams } = new URL(request.url);

    const fee = searchParams.get("fee");
    let fields = searchParams.get("fields") || "";
    if (fields) {
        fields = decodeURIComponent(fields);
        fields = fields.split("|");
    }

    const redirectUrl = searchParams.get("redirectUrl") || "";
    const outTradeNo = searchParams.get("outTradeNo") || Date.now().toString();

    const order = await createOrder({ fee: Number(fee), outTradeNo, redirectUrl, fields });

    const paymentUrl = `${process.env.HOST}/pay?id=${order._id}`
    return Response.redirect(paymentUrl)
}

export const POST: APIRoute = async ({ request }) => {
    let { fee, outTradeNo, redirectUrl, fields } = await request.json()
    outTradeNo = outTradeNo || Date.now().toString();

    const order = await createOrder({ fee, outTradeNo, redirectUrl, fields })
    const paymentUrl = `${process.env.HOST}/pay?id=${order._id}`

    return Response.json({ paymentUrl, order })
}

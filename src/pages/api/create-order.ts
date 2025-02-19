import db from "@/lib/db"
import type { APIRoute } from "astro"

export const prerender = false;
let createOrder = async ({ fee, outTradeNo, redirectUrl, fields, title, email }: { fee: number, outTradeNo: string, redirectUrl: string, fields: any, title: string, email: string }) => {
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
        title: title.replaceAll('null', ''),
        email: email.replaceAll('null', ''),
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
    const email = searchParams.get("email") || "";
    const title = searchParams.get("title") || "";
    const order = await createOrder({ fee: Number(fee), outTradeNo, redirectUrl, fields, email, title });

    const paymentUrl = `${process.env.HOST}/pay?id=${order._id}`
    return Response.redirect(paymentUrl)
}

export const POST: APIRoute = async ({ request }) => {
    let { fee, outTradeNo, redirectUrl, fields, title, email } = await request.json()
    outTradeNo = outTradeNo || Date.now().toString();

    const order = await createOrder({ fee, outTradeNo, redirectUrl, fields, title: title || "", email: email || "" })
    const paymentUrl = `${process.env.HOST}/pay?id=${order._id}`

    return Response.json({ paymentUrl, order })
}

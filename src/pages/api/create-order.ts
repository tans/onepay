import db from "@/lib/db"
import type { APIRoute } from "astro"

export const prerender = false;
let createOrder = async ({ fee, outTradeNo, redirectUrl }: { fee: number, outTradeNo: string, redirectUrl: string }) => {
    const { insertedId } = await db.onepay.insertOne({
        fee,
        outTradeNo,
        redirectUrl,
        createdAt: new Date()
    })
    const order = await db.onepay.findOne({ _id: insertedId })
    return order
}
export const GET: APIRoute = async ({ request }) => {

    const { searchParams } = new URL(request.url);

    const fee = searchParams.get("fee");
    const redirectUrl = searchParams.get("redirectUrl") || "";
    const outTradeNo = searchParams.get("outTradeNo") || Date.now().toString();
    const order = await createOrder({ fee: Number(fee), outTradeNo, redirectUrl });

    if (!order) {
        return new Response("Order not found", { status: 404 });
    }

    const paymentUrl = `${process.env.HOST}/pay/${order._id}`
    return Response.redirect(paymentUrl)
}

export const POST: APIRoute = async ({ request }) => {
    let { fee, outTradeNo, redirectUrl } = await request.json()
    const order = await createOrder({ fee, outTradeNo, redirectUrl })
    const paymentUrl = `${process.env.HOST}/pay/${order._id}`

    return Response.json({ paymentUrl, order })
}

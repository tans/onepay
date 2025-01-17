import db from "@/lib/db";

export const prerender = false;
export const GET = async (req: Request) => {
    const outTradeNo = new URL(req.url).searchParams.get("outTradeNo");
    if (!outTradeNo) {
        return new Response(JSON.stringify({ code: 400, message: "outTradeNo 不能为空" }));
    }
    const order = await db.onepay.findOne({ outTradeNo });

    if (!order) {
        return new Response(JSON.stringify({ code: 404, message: "订单不存在" }));
    }
    return new Response(JSON.stringify({ order }));
};

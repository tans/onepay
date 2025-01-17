import db from "@/lib/db";

export const GET = async (req: Request) => {
    const { outTradeNo } = req.query;
    const order = await db.onepay.findOne({ outTradeNo });

    if (!order) {
        return new Response(JSON.stringify({ code: 404, message: "订单不存在" }));
    }
    return new Response(JSON.stringify({ order }));
};

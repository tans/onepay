import db from "@/lib/db";
import { ObjectId } from "mongodb";

export const prerender = false;
export const GET = async (req: Request) => {
    const id = new URL(req.url).searchParams.get("id");
    const outTradeNo = new URL(req.url).searchParams.get("out_trade_no");
    const email = new URL(req.url).searchParams.get("email");
    if (!id && !outTradeNo && !email) {
        return Response.json({ status: false, code: 400, message: "id 或 out_trade_no 或 email 不能为空" });
    }

    const query = id ? { _id: new ObjectId(id) } : outTradeNo ? { out_trade_no: outTradeNo } : { email };

    const orders = await db.onepay.find(query).toArray();

    if (orders.length === 0) {
        return Response.json({ status: false, code: 404, message: "订单不存在" });
    }
    return Response.json({ status: true, orders, order: orders[0] });
};

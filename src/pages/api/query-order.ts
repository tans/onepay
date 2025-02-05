import db from "@/lib/db";
import { ObjectId } from "mongodb";

export const prerender = false;
export const GET = async (req: Request) => {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
        return Response.json({ status: false, code: 400, message: "id 不能为空" });
    }
    const order = await db.onepay.findOne({ _id: new ObjectId(id) });

    if (!order) {
        return Response.json({ status: false, code: 404, message: "订单不存在" });
    }
    return Response.json({ status: true, order });
};

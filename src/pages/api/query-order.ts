import db from "@/lib/db";
import { ObjectId } from "mongodb";

export const prerender = false;
export const GET = async (req: Request) => {
    const response = new Response();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return response;
    }

    const id = new URL(req.url).searchParams.get("id");
    const outTradeNo = new URL(req.url).searchParams.get("out_trade_no");
    const email = new URL(req.url).searchParams.get("email");

    if (!id && !outTradeNo && !email) {
        return new Response(JSON.stringify({
            status: false,
            code: 400,
            message: "id 或 out_trade_no 或 email 不能为空"
        }), {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });
    }

    const query: any = id ? { _id: new ObjectId(id) } : outTradeNo ? { out_trade_no: outTradeNo } : { email };
    query.status = 'paid';

    const orders = await db.onepay.find(query, { sort: { _id: -1 } }).toArray();

    if (orders.length === 0) {
        return new Response(JSON.stringify({
            status: false,
            code: 404,
            message: "订单不存在"
        }), {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });
    }

    return new Response(JSON.stringify({
        status: true,
        orders,
        order: orders[0]
    }), {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    });
};

import db from "@/lib/db";
import { ObjectId } from "mongodb";

export const prerender = false;

export const OPTIONS = async (req: Request) => {
    const response = new Response();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin,  Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    return response;
}

export const GET = async (req: Request) => {

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
    if (!id) {
        query.status = 'paid';
    }

    const orders = await db.onepay.find(query, { sort: { _id: -1 } }).toArray();

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

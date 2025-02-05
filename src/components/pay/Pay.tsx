

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import AlipayIcon from "../icons/alipay";
import WePayIcon from "../icons/wepay";
import { Loader2 } from "lucide-react";

export default function Pay() {
    const [id, setId] = useState(null);
    const [order, setOrder] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [payWay, setPayWay] = useState("alipay-pc");
    const [html, setHtml] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const _id = new URLSearchParams(window.location.search).get("id");
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobile(isMobile);
        if (isMobile) {
            setPayWay("alipay-mobile");
        }

        if (_id) {
            setId(_id);
            fetch("/api/query-order?id=" + _id).then((res) => res.json()).then((data) => {
                setOrder(data.order);
                setLoading(false);
            });
        }
    }, []);

    const handlePay = async () => {
        try {
            if (payWay === "alipay-pc") {
                location.href = `/api/${id}/alipay-pc`;

            }
            if (payWay == 'wechat-pc') {
                location.href = `/pay/${id}`;
            }
            if (payWay == 'alipay-mobile') {
                location.href = `/api/${id}/alipay-wap`;
            }
            if (payWay == 'wechat-mobile') {
                location.href = `/pay/${id}`;
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return <div className="max-w-sm mx-auto m-8 p-4 shadow-md rounded-md border border-gray-200">
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
            </div>
        </div>
    }
    return <div className="max-w-sm mx-auto m-8 p-4 shadow-md rounded-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center">收银台</h1>

        <h2 className="text-xl font-black text-red-800 p-4 text-center">{order?.fee / 100}元</h2>
        {isMobile && <>
            <RadioGroup onValueChange={(value) => setPayWay(value)} value={payWay}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem id="alipay-mobile" value="alipay-mobile"></RadioGroupItem>
                    <Label htmlFor="alipay-mobile" className="flex items-center space-x-2">
                        <AlipayIcon className="w-6 h-6" />
                        <div>支付宝</div>
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem id="wechat-mobile" value="wechat-mobile"></RadioGroupItem>
                    <Label htmlFor="wechat-mobile" className="flex items-center space-x-2">
                        <WePayIcon className="w-6 h-6" />
                        <div>微信</div>
                    </Label>
                </div>
            </RadioGroup>
        </>}
        {!isMobile &&
            <RadioGroup onValueChange={(value) => setPayWay(value)} value={payWay}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem id="alipay-pc" value="alipay-pc"></RadioGroupItem>
                    <Label htmlFor="alipay-pc" className="flex items-center space-x-2">
                        <AlipayIcon className="w-6 h-6" />
                        <div>支付宝</div>
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem id="wechat-pc" value="wechat-pc"></RadioGroupItem>
                    <Label htmlFor="wechat-pc" className="flex items-center space-x-2">
                        <WePayIcon className="w-6 h-6" />
                        <div>微信</div>
                    </Label>
                </div>
            </RadioGroup>
        }
        <div className="mt-4">
            <Button onClick={handlePay} className="w-full mx-auto ">支付</Button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
}

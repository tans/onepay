# 欢迎使用 OnePay收银台

让不同产品使用统一的支付后台


### 快速部署

- 一键部署，免开发，支持 Vercel。

### 多种支付方式

- 集成微信支付，支付宝，加密货币等。

## 主要功能

- 每次开发新产品，都需要重新开发支付后台，成本高，维护难。
- 通过 OnePay，可以轻松集成多种支付方式，让不同产品使用统一的支付后台。
- 免去重复的开发，避免密钥泄露风险，统一管理支付渠道。

## 使用步骤

### 步骤 1: 部署 OnePay

- 部署到 Vercel
- 配置环境变量

```
# 主机
HOST=https://域名

# 微信支付
WEPAY_APPID=公众号appid
WEPAY_MCHID=商户号
WEPAY_SECRET=商户密钥

# 数据库
MONGODB_URI=mongodb://用户名:密码@主机:端口/数据库名?authSource=数据库名
MONGO_DB=数据库名
```

### 步骤 2: 创建支付订单

- 跳转到 `HOST/api/create-order`

#### 参数:

- `fee`: 单位为分，100 表示 1元
- `redirectUrl`: 支付完成后跳转的地址

### 步骤 3: 获取支付结果

- 回调: 创建订单时传入的回调地址参数 `notifyUrl`
- 轮询: 根据订单号查询支付结果

## API 文档

### 创建订单 `/api/create-order`

- `fee`: 单位为分，100 表示 1元
- `redirectUrl`: 支付完成后跳转的地址
- `notifyUrl`: 支付结果回调地址

### 查询订单 `/api/query-order`

- `outTradeNo`: 订单号
import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const client = new MongoClient(process.env.MONGODB_URI)
const db = client.db(process.env.MONGO_DB)

export default {
    onepay: db.collection('onepay'),
    ObjectId: ObjectId
}

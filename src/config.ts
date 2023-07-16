import { config } from 'dotenv'
config()

const PORT: Number = Number(process.env.PORT) || 3000

const settings: any = {
    PORT: PORT,
    ENV: 'development'
}
export default settings
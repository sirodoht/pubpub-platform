import redis from "redis"
import manifest from "./pubpub-manifest.json"

export type InstanceConfig = { words: boolean; lines: boolean }

const db = redis.createClient({ url: process.env.REDIS_CONNECTION_STRING })

try {
	await db.connect()
} catch (error) {
	console.log("Failed to connect to Redis")
	console.error(error)
	process.exit(1)
}

export const makeInstanceConfig = (): InstanceConfig => ({
	words: false,
	lines: false,
})

export const findInstanceConfig = (instanceId: string) =>
	db
		.get(`${manifest.name}:${instanceId}`)
		.then((value) => value && (JSON.parse(value) as InstanceConfig))

export const updateInstanceConfig = (
	instanceId: string,
	instanceConfig: InstanceConfig
) => db.set(`${manifest.name}:${instanceId}`, JSON.stringify(instanceConfig))

export const getAllInstanceIds = async () =>
	(await db.keys(`${manifest.name}:*`))?.map((key) => key.split(":")[1])
import * as sdk from "@pubpub/integration-sdk"
import { Eta } from "eta"
import express from "express"
import { ok as assert } from "node:assert"
import process from "node:process"
import {
	findInstanceConfig,
	getAllInstanceIds,
	makeInstanceConfig,
	updateInstanceConfig,
} from "./config"
import { DataciteError, createDoi, deleteDoi } from "./datacite"
import manifest from "./pubpub-manifest.json"

const app = express()
const eta = new Eta({ views: "views", cache: true })
const client = sdk.makeClient(manifest)

app.use(express.json())
app.use(
	"/pubpub-manifest.json",
	express.static(process.cwd() + "/pubpub-manifest.json")
)

// pubpub integration routes

app.get("/configure", async (req, res, next) => {
	try {
		const { instanceId } = req.query
		assert(typeof instanceId === "string")
		const instanceConfig =
			(await findInstanceConfig(instanceId)) ?? makeInstanceConfig()
		instanceConfig.password = ""
		res.send(
			eta.render("configure", {
				title: "Configure DataCite Integration",
				instanceConfig,
				instanceId,
			})
		)
	} catch (error) {
		next(error)
	}
})

app.get("/apply", async (req, res, next) => {
	try {
		const { instanceId, pubId } = req.query
		assert(typeof instanceId === "string")
		assert(typeof pubId === "string")
		const instanceConfig = await findInstanceConfig(instanceId)
		if (instanceConfig) {
			res.send(
				eta.render("apply", {
					title: "Assign DOI",
					instanceId,
					instanceConfig,
					pubId,
				})
			)
		} else {
			throw new sdk.ResponseError(400, "Instance not configured")
		}
	} catch (error) {
		next(error)
	}
})

app.post("/apply", async (req, res, next) => {
	try {
		const { instanceId, pubId } = req.query
		assert(typeof instanceId === "string")
		assert(typeof pubId === "string")
		const instanceConfig = await findInstanceConfig(instanceId)
		if (instanceConfig) {
			let { "pubpub/doi": doi } = await client.get(
				instanceId,
				pubId,
				"pubpub/doi"
			)
			doi ||= await createDoi(instanceConfig)
			try {
				await client.put(instanceId, pubId, { "pubpub/doi": doi })
			} catch (error) {
				// TODO(3mcd): type of DOI should be inferred from manifest
				assert(typeof doi === "string")
				await deleteDoi(instanceConfig, doi)
				throw error
			}
			res.json({ doi })
		} else {
			throw new sdk.ResponseError(400, "Instance not configured")
		}
	} catch (error) {
		next(error)
	}
})

// internal routes

app.put("/configure", async (req, res, next) => {
	try {
		const { instanceId } = req.query
		const instanceConfig = req.body
		assert(typeof instanceId === "string")
		await updateInstanceConfig(instanceId, instanceConfig)
		res.send(instanceConfig)
	} catch (error) {
		next(error)
	}
})

app.get("/debug", async (_, res, next) => {
	try {
		const instanceIds = await getAllInstanceIds()
		res.send(eta.render("debug", { title: "debug", instanceIds }))
	} catch (error) {
		next(error)
	}
})

app.use((error: any, _: any, res: any, next: any) => {
	const { cause: errorCause, constructor: errorType } = error
	switch (errorType) {
		case sdk.ResponseError:
			res.status(error.cause.status).json(error)
			return
		case sdk.PubPubError:
			// Use 502 for all PubPub errors
			res
				.status(errorCause instanceof sdk.ResponseError ? 502 : 500)
				.json(error)
			return
		case DataciteError:
			if (errorCause instanceof sdk.ResponseError) {
				switch (errorCause.cause.status) {
					// DataCite returns:
					// - 404 if credentials are invalid
					// - 500 if credentials are malformatted
					case 403:
					case 404:
					case 500:
						res.status(403).json(error)
						return
					// Fall back to 502 (Bad Gateway) for other DataCite errors
					default:
						res.status(502).json(error)
						return
				}
			}
	}
	res
		.status(500)
		.json(new sdk.IntegrationError("Internal Server Error", { cause: error }))
})

app.listen(process.env.PORT, () => {
	console.log(`DataCite integration is up (port=${process.env.PORT})`)
})
import { sourceNodes } from "../gatsby-node"

describe("Run Test", () => {
	const mockReporter = {
		info(message) {
			console.info(message)
		},
		warn(message) {
			console.warn(message)
		},
		error(message, error) {
			console.error(message, error)
		},
		panic(message, error) {
			console.panic(message, error)
		},
	}
	const cache = new Map()
	const mockCache = {
		async get(key) {
			new Promise((resolve) => {
				resolve(cache.get(key))
			})
		},
		async set(key, data) {
			new Promise((resolve) => {
				cache.set(key, data)
				resolve(cache)
			})
		},
	}

	test(
		"Run",
		async () => {
			const res = await sourceNodes(
				{
					reporter: mockReporter,
					cache: mockCache,
				},
				{
					token: process.env.NOTION_INTEGRATION_TOKEN,
					databaseId: process.env.NOTION_DB_ID,
					notionVersion: "2022-06-28",
					checkPublish: true,
				},
			)

			expect(res.length).toBeGreaterThan(0)
		},
		1000 * 60 * 5,
	)
})

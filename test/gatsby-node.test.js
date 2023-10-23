import { sourceNodes } from "../gatsby-node"
import { getPages } from "../src/notion-api/get-pages"

describe("Notion Test", () => {
	const mockReporter = {
		error(error) {
			console.error(error)
		},
	}
	const mockCache = new Map()

	test(
		"Get Pages",
		async () => {
			const res = await getPages(
				{
					token: process.env.NOTION_INTEGRATION_TOKEN,
					databaseId: process.env.NOTION_DB_ID,
					notionVersion: "2022-06-28",
					checkPublish: true,
				},
				mockReporter,
				mockCache,
			)

			expect(res.length).toBeGreaterThan(0)
		},
		1000 * 60 * 5,
	)
})

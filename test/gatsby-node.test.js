import { sourceNodes } from "../gatsby-node";

describe("Run Test", () => {
	const mockActions = {
		createNode(node) {
			console.log(`[SUCCESS] Created Node : ${node.title}`);
			return node;
		},
	};
	const mockReporter = {
		info(message) {
			console.info(message);
		},
		warn(message) {
			console.log(message);
		},
		error(message, error) {
			console.error(message, error);
		},
		panic(message, error) {
			console.error(message, error);
		},
	};
	const cache = new Map();
	const mockCache = {
		async get(key) {
			new Promise((resolve) => {
				resolve(cache.get(key));
			});
		},
		async set(key, data) {
			new Promise((resolve) => {
				cache.set(key, data);
				resolve(cache);
			});
		},
	};

	test(
		"Run",
		async () => {
			await sourceNodes(
				{
					actions: mockActions,
					createNodeId: (id) => id,
					reporter: mockReporter,
					cache: mockCache,
				},
				{
					token: process.env.NOTION_INTEGRATION_TOKEN,
					databaseIds: [process.env.NOTION_DB_ID, process.env.NOTION_DB_ID_2],
					groups: ['Book', 'Movie'],
					checkPublish: [true, false],
					notionVersion: "2022-06-28",
				},
			);
		},
		1000 * 60 * 10,
	);
});

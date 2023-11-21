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
					createContentDigest: () => {},
					createNodeId: () => {},
					reporter: mockReporter,
					cache: mockCache,
				},
				{
					token: process.env.NOTION_INTEGRATION_TOKEN,
					databases: [
						{
							id: process.env.NOTION_DB_ID,
							name: "Book",
							isCheckPublish: true,
						},
						{
							id: process.env.NOTION_DB_ID_2,
							name: "Movie",
						},
					],
				},
			);
		},
		1000 * 60 * 10,
	);
});

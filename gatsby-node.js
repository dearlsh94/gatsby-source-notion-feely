const { getPages } = require("./src/notion-api/get-pages");
const { getNotionPageProperties } = require("./src/transformers/get-page-properties");
const { getNotionPageTitle } = require("./src/transformers/get-page-title");

exports.sourceNodes = async (
	{ actions, createContentDigest, createNodeId, reporter, cache },
	{ token, databases = [] },
) => {
	const NOTION_NODE_TYPE = "Notion";

	for (const database of databases) {
		const pages = await getPages(
			{ token, databaseId: database.id, isCheckPublish: database.isCheckPublish },
			reporter,
			cache,
		);
		pages.forEach((page) => {
			const title = getNotionPageTitle(page);
			const properties = getNotionPageProperties(page);

			actions.createNode({
				id: createNodeId(`${NOTION_NODE_TYPE}-${page.id}`),
				parent: null,
				children: [],
				internal: {
					type: NOTION_NODE_TYPE,
					mediaType: "text/javascript",
					contentDigest: createContentDigest(page),
				},
				databaseName: database.name,
				title,
				page: page,
				properties,
				createdAt: page.created_time,
				updatedAt: page.last_edited_time,
			});
		});
	}
};

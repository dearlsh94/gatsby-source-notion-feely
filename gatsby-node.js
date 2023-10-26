const { getPages } = require("./src/notion-api/get-pages");
const { getNotionPageProperties } = require("./src/transformers/get-page-properties");
const { getNotionPageTitle } = require("./src/transformers/get-page-title");


exports.sourceNodes = async (
	{ actions, createContentDigest, createNodeId, reporter, cache },
	{ token, databaseIds, groups = [], checkPublish = [] },
	) => {
	const NOTION_NODE_TYPE = "Notion";

	for (let i = 0; i < databaseIds.length; i++) {
		const pages = await getPages({ token, databaseId: databaseIds[i], checkPublish: checkPublish[i] }, reporter, cache);
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
				group: groups[i],
				title,
				properties,
				archived: page.archived,
				createdAt: page.created_time,
				updatedAt: page.last_edited_time,
				raw: page,
				json: JSON.stringify(page),
			});
		});
	}
};

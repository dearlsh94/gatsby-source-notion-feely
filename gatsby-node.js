import { getPages } from "./src/notion-api/get-pages";
import { getTitleByNotionPage } from "./src/util/parse";
import { NOTION_NODE_TYPE } from "./src/constants";

export async function sourceNodes(
	{ actions, createContentDigest, createNodeId, reporter, cache },
	{ token, databases = [] },
) {
	for (const database of databases) {
		const pages = await getPages(
			{ token, databaseId: database.id, pageFilter: database.pageFilter, option: database.option },
			reporter,
			cache,
		);
		pages.forEach((page) => {
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
				title: getTitleByNotionPage(page),
				json: JSON.stringify(page),
				createdAt: page.created_time,
				updatedAt: page.last_edited_time,
			});
		});
	}
}

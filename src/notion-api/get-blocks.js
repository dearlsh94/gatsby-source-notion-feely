import { fetchWithRetry } from "../util/fetch";

async function fetchBlocks({ id, notionVersion, token, cursor }, reporter) {
	let url = `https://api.notion.com/v1/blocks/${id}/children`;
	if (cursor) url += `?start_cursor=${cursor}`;

	try {
		return fetchWithRetry(url, {
			headers: {
				"Content-Type": "application/json",
				"Notion-Version": notionVersion,
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (error) {
		reporter.error("[ERROR] fetching blocks: ", error);
		return {
			results: [],
			has_children: false,
		};
	}
}

export async function getBlocks({ id, token, notionVersion = "2022-06-28" }, reporter) {
	let hasMore = true;
	let blockContent = [];
	let startCursor = "";

	try {
		while (hasMore) {
			const result = await fetchBlocks({ id, notionVersion, token, cursor: startCursor }, reporter);

			for (let childBlock of result.results) {
				if (childBlock.has_children) {
					childBlock.children = await getBlocks({ id: childBlock.id, notionVersion, token }, reporter);
				}
			}

			blockContent = [...blockContent, ...result.results];
			startCursor = result.next_cursor;
			hasMore = result.has_more;
		}
	} catch (error) {
		reporter.error("[ERROR] get blocks: ", error);
		return blockContent;
	}
}

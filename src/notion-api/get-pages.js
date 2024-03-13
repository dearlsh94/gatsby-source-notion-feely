import { getBlocks } from "./get-blocks";
import { fetchPost } from "../util/fetch";
import { getTitleByNotionPage } from "../util/parse";
import { NOTION_API_VERSION } from "../constants";

async function fetchPage({ cursor, token, databaseId, pageFilter }, reporter) {
	const url = `https://api.notion.com/v1/databases/${databaseId}/query`;
	const body = {
		page_size: 100,
		filter: pageFilter || { and: [] },
		...(cursor && { start_cursor: cursor }),
	};

	try {
		return fetchPost(url, {
			headers: {
				"Content-Type": "application/json",
				"Notion-Version": NOTION_API_VERSION,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});
	} catch (error) {
		reporter.error(`[ERROR] fetching page: ${error}`);
		return { results: [], next_cursor: "", has_more: false };
	}
}

async function fetchPageChildren({ page, token }, reporter, cache) {
	const title = getTitleByNotionPage(page);
	const cacheKey = `notionApiPageChildren:${page.id}:${page.last_edited_time}`;

	let children = await cache.get(cacheKey);
	if (!children) {
		children = await getBlocks({ id: page.id, token }, reporter);
		await cache.set(cacheKey, children);
		reporter.info(`[SUCCESS] fetched page and cached > ${title}`);
	} else {
		reporter.info(`[SUCCESS] get cached page > ${title}`);
	}
	return children;
}

export async function getPages(
	{
		token,
		databaseId,
		pageFilter = undefined,
		option = {
			isIncludeChildren: true,
		},
	},
	reporter,
	cache,
) {
	const { isIncludeChildren } = option;
	const pages = [];
	let hasMore = true;
	let startCursor = "";

	try {
		while (hasMore) {
			const result = await fetchPage({ cursor: startCursor, token, databaseId, pageFilter }, reporter, cache);
			if (!!result.results.length) {
				reporter.info(`[SUCCESS] total pages > ${result.results.length}`);
			}

			for (let page of result.results) {
				if (isIncludeChildren) {
					page.children = await fetchPageChildren({ page, token }, reporter, cache);
				}
				pages.push(page);
			}

			startCursor = result.next_cursor;
			hasMore = result.has_more;
		}
	} catch (error) {
		reporter.error("[ERROR] fetching pages: ", error);
	}

	return pages;
}

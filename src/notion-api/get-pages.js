import { fetchPost } from "../util/fetch";
import { getBlocks } from "./get-blocks";
import { getNotionPageTitle } from "../transformers/get-page-title";

async function fetchPage({ cursor, token, databaseId, pageFilter, notionVersion }, reporter) {
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
				"Notion-Version": notionVersion,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});
	} catch (error) {
		reporter.error(`[ERROR] fetching page: ${error}`);
		return { results: [], next_cursor: "", has_more: false };
	}
}

async function fetchPageChildren({ page, token, notionVersion }, reporter, cache) {
	const title = getNotionPageTitle(page);
	const cacheKey = `notionApiPageChildren:${page.id}:${page.last_edited_time}`;

	let children = await cache.get(cacheKey);
	if (!children) {
		children = await getBlocks({ id: page.id, token, notionVersion }, reporter);
		await cache.set(cacheKey, children);
		reporter.info(`[SUCCESS] fetched page and cached > ${title}`);
	} else {
		reporter.info(`[SUCCESS] get cached page > ${title}`);
	}
	return children;
}

export async function getPages(
	{
		databaseId,
		token,
		notionVersion = "2022-06-28",
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
			const result = await fetchPage(
				{ cursor: startCursor, token, databaseId, pageFilter, notionVersion },
				reporter,
				cache,
			);
			if (!!result.results.length) {
				reporter.info(`[SUCCESS] total pages > ${result.results.length}`);
			}

			for (let page of result.results) {
				if (isIncludeChildren) {
					page.children = await fetchPageChildren({ page, token, notionVersion }, reporter, cache);
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

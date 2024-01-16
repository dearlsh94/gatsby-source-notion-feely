const fetch = require("node-fetch");
const { errorMessage } = require("../error-message");
const { getBlocks } = require("./get-blocks");
const { getNotionPageTitle } = require("../transformers/get-page-title");

async function fetchPage({ cursor, token, databaseId, pageFilter, notionVersion }, reporter) {
	const url = `https://api.notion.com/v1/databases/${databaseId}/query`;
	const body = {
		page_size: 100,
		filter: {
			and: [],
		},
	};

	if (cursor) {
		body.start_cursor = cursor;
	}

	if (pageFilter) {
		body.filter = pageFilter;
	}

	try {
		const result = await fetch(url, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
				"Notion-Version": notionVersion,
				Authorization: `Bearer ${token}`,
			},
		}).then((res) => res.json());

		const { object, status, code, message } = result;
		if (object === "error") {
			throw new Error(`[${status}-${code}] ${message} ${errorMessage}`);
		}

		reporter.info(`[SUCCESS] Total Pages > ${result.results.length}`);
		return result;
	} catch (error) {
		reporter.error(error);
		return {
			results: [],
			next_cursor: "",
			has_more: false,
		};
	}
}

async function fetchPageChildren({ page, token, notionVersion }, reporter, cache) {
	const title = getNotionPageTitle(page);
	const cacheKey = `notionApiPageChildren:${page.id}:${page.last_edited_time}`;

	let children = await cache.get(cacheKey);

	if (children) {
		reporter.info(`[SUCCESS] Get Cached Page > ${title}`);
		return children;
	}

	children = await getBlocks({ id: page.id, token, notionVersion, cacheKey }, reporter, cache);
	await cache.set(cacheKey, children);
	reporter.info(`[SUCCESS] Get Page > ${title}`);
	return children;
}

const defaultOption = {
	isIncludeChildren: true,
};

exports.getPages = async (
	{ databaseId, token, notionVersion = "2022-06-28", pageFilter = undefined, option = defaultOption },
	reporter,
	cache,
) => {
	const { isIncludeChildren } = option;
	const pages = [];
	let hasMore = true;
	let startCursor = "";

	while (hasMore) {
		const result = await fetchPage(
			{ cursor: startCursor, token, databaseId, pageFilter, notionVersion },
			reporter,
			cache,
		);

		startCursor = result.next_cursor;
		hasMore = result.has_more;

		for (let page of result.results) {
			if (isIncludeChildren) {
				page.children = await fetchPageChildren({ page, token, notionVersion }, reporter, cache);
			} else {
				page.children = [];
			}

			pages.push(page);
		}
	}

	return pages;
};

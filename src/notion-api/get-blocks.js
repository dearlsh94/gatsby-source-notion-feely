const fetch = require("node-fetch")
const { errorMessage } = require("../error-message")

async function fetchBlocks({ id, notionVersion, token, cursor }, reporter) {
	let url = `https://api.notion.com/v1/blocks/${id}/children`

	if (cursor) {
		url += `?start_cursor=${cursor}`
	}

	try {
		const result = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				"Notion-Version": notionVersion,
				Authorization: `Bearer ${token}`,
			},
		}).then((res) => res.json())

		return result
	} catch (error) {
		reporter.error(error)
	}
}

exports.getBlocks = async ({ id, notionVersion, token }, reporter) => {
	let hasMore = true
	let blockContent = []
	let startCursor = ""

	while (hasMore) {
		const result = await fetchBlocks(
			{
				id,
				notionVersion,
				token,
				cursor: startCursor,
			},
			reporter,
		)

		for (let childBlock of result.results) {
			if (childBlock.has_children) {
				childBlock.children = await fetchBlocks({ id: childBlock.id, notionVersion, token }, reporter)
			}
		}

		blockContent = blockContent.concat(result.results)
		startCursor = result.next_cursor
		hasMore = result.has_more
	}

	return blockContent
}

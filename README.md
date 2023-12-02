<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby + Notion = ✨
</h1>
<div>
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000"/>
	<img src="https://img.shields.io/badge/Gatsby-663399?logo=gatsby&logoColor=fff"/>
	<img src="https://img.shields.io/badge/Notion-fff?logo=notion&logoColor=000"/>
</div>

## 소개

Notion에 아카이빙한 문서들을 Gatsby 정적 블로그로 서비스하기 위해 처음 개발된 플러그인입니다.

손쉽게 Gatsby에 Notion 데이터베이스를 연결하여 GraphQL로 조회할 수 있습니다.

1개의 Notion 계정과만 연결이 가능하며, 해당 계정 내의 여러 데이터베이스를 연결할 수 있습니다.

- [Weezip](https://weezip.treefeely.com) 블로그 서비스에 사용하고 있습니다.
- [orlowdev/gatsby-source-notion-api](https://github.com/orlowdev/gatsby-source-notion-api) 플러그인을 fork하여 개발되었습니다.

### 참고

- [Notion API Reference](https://developers.notion.com/reference/intro)
- [Notion API Databases](https://developers.notion.com/docs/working-with-databases)

## 안내

- Notion의 공식 API `2022-06-28` 버전을 사용합니다.
- 현재 마크다운 양식은 지원하고 있지 않습니다. 추후 지원될 수도 있습니다.
- Notion의 자체적인 [request-limits](https://developers.notion.com/reference/request-limits) 제한 정책으로 인해, block 정보를 조회하는 과정에서 15초 간격으로 최대 4번까지 추가로 API를 호출할 수 있습니다. (총 5번)
- 모든 block 정보가 조회된 페이지는 Gatsby 내에 캐싱 됩니다. NOtion에서 페이지가 수정된다면 다시 조회합니다.

## 설치

```sh
yarn add gatsby-source-notion-feely
```

or

```sh
npm install --save gatsby-source-notion-feely
```

## Required Arguments

### `token`

type: `string`  
Notion에서 발급받은 토큰 키 값 입니다.

### `databases`

type: `Array<Database>`

```typescript
arguments {
	id: string;
	name: string;
	pageFilter?: NotionFilterJSON;
}
```

- `id` : Notion 데이터베이스 ID
- `name` : 조회한 데이터베이스들에 대해 명시적 구분을 위해 사용할 이름
- `pageFilter` : Notion 데이터베이스 필터 쿼리 ([Filter database entries](https://developers.notion.com/reference/post-database-query-filter) 참고)

## Return

### `id`

type: `string`  
페이지마다 생성된 Gatsby 노드 ID.  
[Gatsby 공식 문서](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNode)에서 더 자세히 확인할 수 있습니다.

### `parent`

type: `string` or `null`  
부모 노드 ID.

### `children`

type: `Array<string>`  
자식 노드 ID의 배열.

### `databaseName`

type: `string`  
설정한 데이터베이스 이름

### `title`

type: `string`  
데이터베이스에 `title`로 설정된 컬럼의 정보.

### `json`

데이터베이스에 저장된 페이지 정보를 JSON string으로 변환한 정보.

- [Notion API 공식 문서](https://developers.notion.com/reference/database)에서 더 자세히 확인할 수 있습니다.

### `createdAt`

type: `string`  
데이터베이스가 생성된 ISO 8601 형식의 날짜 및 시간.

### `updatedAt`

type: `string`  
데이터베이스가 마지막으로 변경된 ISO 8601 형식의 날짜 및 시간.

## 설정

먼저 Notion API 호출을 위한 Secret Key와 연결할 데이터베이스 ID가 필요합니다.

1. Notion에 로그인 후 새 Integration을 생성합니다. > [Create Link](https://www.notion.so/my-integrations)
   - 이미 사용 중인게 있다면, 이 단계는 건너뛰어도 좋습니다.
   - 더 자세한 내용은 [Notion Guide](https://developers.notion.com/docs/create-a-notion-integration#step-3-save-the-database-id)를 확인해주세요.
2. Notion에서 연결할 데이터베이스를 생성합니다.
3. 데이터베이스 - [Share] - [Invite] 에서 위에 생성했던 Integration을 초대합니다.
4. 데이터베이스 Key를 확인합니다
   > To find a database ID, navigate to the database URL in your Notion workspace. The ID is the string of characters in the URL that is between the slash following the workspace name (if applicable) and the question mark. The ID is a 32 characters alphanumeric string.
   - 더 자세한 내용은 [Notion Guide](https://developers.notion.com/reference/retrieve-a-database)를 확인해주세요.
5. `gatsby-config.json`에 설정을 추가합니다.
   ```javascript
   plugins: [
   	{
   		resolve: `gatsby-source-notion-feely`,
   		options: {
   			token: `$INTEGRATION_TOKEN`,
   			databases: [
   				{
   					id: `$DATABASE_ID`,
   					name: `$DATABASE_NAME`,
   				},
   			],
   		},
   	},
   	// ...
   ];
   ```
6. 이제 Gatsby에서 GraphQL로 조회할 수 있습니다!

- `JSON.parse(json)` 을 통해 Notion 페이지 객체를 이용할 수 있습니다.

### 예시

```javascript
plugins: [
	{
		resolve: `gatsby-source-notion-feely`,
		options: {
			token: `$INTEGRATION_TOKEN`,
			databases: [
				{
					id: `$DATABASE_ID`,
					name: `$DATABASE_NAME`,
					pageFilter: {
						property: "is_published",
						checkbox: {
							equals: true,
						},
					},
				},
				{
					id: `$DATABASE_ID_2`,
					name: `$DATABASE_NAME_2`,
				},
			],
		},
	},
];
```

- `$DATABASE_ID` 데이터베이스에서는 `is_published` 체크박스가 `true`인 페이지를 조회하며, 여기서 생성된 Node는 `databaseName` 프로퍼티로 `$DATABASE_NAME` 값을 가집니다.
- `$DATABASE_ID_2` 데이터베이스에서는 모든 페이지를 조회하며, 여기서 생성된 Node는 `databaseName` 프로퍼티로 `$DATABASE_NAME_2` 값을 가집니다.

### Query

```graphql
query {
	allNotion {
		edges {
			node {
				id
				parent
				children
				internal
				databaseName
				title
				json
				createdAt
				updatedAt
			}
		}
	}
}
```

## 삭제된 기능

v2.0.0에서 삭제되었습니다.

- Notion 데이터베이스 매개변수 중 `isCheckPublish` 값이 삭제되었습니다. checkbox 타입의 `is_published` 값을 판단할 수 있게 해주는 이 값은 `pageFilter`로 대체되어 더 폭넓은 필터링을 지원할 수 있게 수정되었습니다.

## 테스트

Jest를 사용하고 있으며, `/test/gatsby-node.test.js` 파일이 실행됩니다.

1. `.env.test` 파일을 추가합니다.
2. 해당 파일에 `NOTION_INTEGRATION_TOKEN`, `NOTION_DB_ID` 값을 설정합니다.
3. `yarn test`를 통해 테스트 결과를 확인할 수 있습니다.

### 참고

- [Gatsby Unit Testing](https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/)

## 감사합니다.

끝까지 읽어주셔서 감사합니다.  
더 멋진 기능을 위한 이슈 생성과 PR을 기다리고 있습니다.

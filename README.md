<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby + Notion = ✨
</h1>

## 소개

Notion에 아카이빙한 문서들을 Gatsby 정적 블로그로 서비스하기 위한 목적의 플러그인입니다. 손쉽게 Gatsby에 Notion Database API를 연결하여 GraphQL로 조회할 수 있습니다. 여러개의 Database 연결도 지원하고 있습니다.

[orlowdev/gatsby-source-notion-api](https://github.com/orlowdev/gatsby-source-notion-api) 플러그인을 fork하여 개발되었습니다.

[Weezip](https://weezip.treefeely.com) 블로그 서비스에 사용하고 있습니다.

### 참고

- [Notion API Reference](https://developers.notion.com/reference/intro)
- [Notion API Databases](https://developers.notion.com/docs/working-with-databases)

## 안내

- 마크다운 양식은 지원하고 있지 않습니다. (추후 지원 예정)
- Notion의 공식 API `2022-06-28` 버전을 사용합니다.
- Notion의 자체적인 [request-limits](https://developers.notion.com/reference/request-limits) 제한으로 인해 오류가 발생하는 경우 15초 간격으로 최대 4번까지 추가로 호출합니다. (총 5번)

## 설치

```sh
yarn add gatsby-source-notion-feely
```

or

```sh
npm install --save gatsby-source-notion-feely
```

## 필수

- `token`: string [required]
  - 노션에서 발급받은 토큰 키
- `databaseIds`: string[] [required]
  - 사용할 데이터베이스 ID로 이루어진 배열

## 추가 옵션
`databaseIds`의 각 데이터베이스마다 동일한 index로 매칭하여 설정됩니다. 사용을 위한 자세한 예시는 아래에서 이어서 더 설명드리겠습니다.

- `aliases`: string[] [default `[]`]
	- 1개의 데이터베이스에 대해 명시적 구분을 위해 사용할 이름입니다.

- `checkPublish`: boolean[] [default `[]`]
  - 사용하는 노션 데이터베이스에 checkbox 타입의 `is_published` 컬럼을 생성해야 합니다.
  - 해당 옵션이 true일 경우, `is_published` 값이 true인 데이터만 조회합니다.

## 설정
먼저 Notion API 호출을 위한 Secret Key와 연결할 Database ID가 필요합니다.

1. Notion에 로그인 후 새 Integration을 생성합니다. > [Create Link](<(https://www.notion.so/my-integrations)>)
   - 이미 사용 중인게 있다면, 이 단계는 건너뛰어도 좋습니다.
   - 더 자세한 내용은 [Notion Guide](https://developers.notion.com/docs/create-a-notion-integration#step-3-save-the-database-id)를 확인해주세요.
2. Notion에서 연결할 Database를 생성합니다.
3. Database - [Share] - [Invite] 에서 위에 생성했던 Integration을 초대합니다.
4. Database Key를 확인합니다
   > To find a database ID, navigate to the database URL in your Notion workspace. The ID is the string of characters in the URL that is between the slash following the workspace name (if applicable) and the question mark. The ID is a 32 characters alphanumeric string.
   - 더 자세한 내용은 [Notion Guide](https://developers.notion.com/reference/retrieve-a-database)를 확인해주세요.
5. `gatsby-config.json`에 설정을 추가합니다.
   ```javascript
   plugins: [
   	{
   		resolve: `gatsby-source-notion-feely`,
   		options: {
   			token: `$INTEGRATION_TOKEN`,
   			databaseId: [`$DATABASE_ID`],
   		},
   	},
   	// ...
   ];
   ```
6. 이제 Gatsby에서 GraphQL로 조회할 수 있습니다!

### 예시
```
plugins: [
	{
		resolve: `gatsby-source-notion-feely`,
		options: {
			token: `$INTEGRATION_TOKEN`,
			databaseId: [`$DATABASE_ID`, `$DATABASE_ID_2`],
			aliases: [`book`, `movie`]
			checkPublish: [true, false],
		}
	}
]
```
-  `$DATABASE_ID` 데이터베이스에서는 `is_published` 체크박스가 `true`인 데이터만 조회하며, 여기서 생성된 Node는 `alias` 프로퍼티로 `book` 값을 가집니다.
-  `$DATABASE_ID_2` 데이터베이스에서는 모든 데이터를 조회하며, 여기서 생성된 Node는 `alias` 프로퍼티로 `movie` 값을 가집니다.
- 이후 Gatsby에서는 `alias` 값으로 구분하여 사용할 수 있습니다.

### Query

```graphql
query {
	allNotion {
		edges {
			node {
				archived
				children {
					id
				}
				createdAt
				id
				json
				parent {
					id
					internal {
						content
					}
				}
				raw {
					archived
					children {
						id
					}
					created_by {
						id
					}
					created_time
					id
					last_edited_by {
						id
					}
					last_edited_time
					object
					parent {
						database_id
						type
					}
					url
				}
				title
				updatedAt
			}
		}
	}
}
```

## 테스트

Jest를 사용하고 있으며, `/test/gatsby-node.test.js` 파일이 실행됩니다.

1. `.env.test` 파일을 추가합니다.
2. 해당 파일에 `NOTION_INTEGRATION_TOKEN`, `NOTION_DB_ID` 값을 설정합니다.
3. `yarn test`를 통해 테스트 결과를 확인할 수 있습니다.

### 참고

- [Gatsby Unit Testing](https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/)

## 감사합니다.

끝까지 읽어주셔서 감사합니다.  
더 멋진 기능을 위한 이슈 생성과 PR은 언제나 환영합니다.

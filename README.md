<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" alt="Gatsby Logo" />
  </a>
</p>
<h1 align="center">
  Gatsby + Notion = ✨
</h1>
<div>
 <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000" alt="JavaScript Badge"/>
 <img src="https://img.shields.io/badge/Gatsby-663399?logo=gatsby&logoColor=fff" alt="Gatsby Badge"/>
 <img src="https://img.shields.io/badge/Notion-fff?logo=notion&logoColor=000" alt="Notion Badge"/>
</div>

## 0. 소개

노션에 아카이빙한 문서들을 Gatsby 정적 블로그로 서비스하기 위해 개발된 플러그인입니다.

손쉽게 Gatsby에서 GraphQL로 노션 데이터베이스를 조회할 수 있습니다.

Gatsby 정적 사이트에서 사용할 컨텐츠를 위한 CMS로 노션을 생각하셨다면, 이 플러그인이 도움이 될 수 있을 것입니다.

1개의 노션 계정만 연결이 가능하며, 해당 계정 내의 여러 데이터베이스와 연결할 수 있습니다.

[orlowdev/gatsby-source-notion-api](https://github.com/orlowdev/gatsby-source-notion-api) 플러그인을 fork하여 개발되었습니다.

### 사용중

- [Weezip](https://weezip.treefeely.com) 블로그 서비스에 사용하고 있습니다.

### 노션 API 공식문서

Notion API를 사용하고 있으므로 아래 문서를 참고하시면 좋습니다.

- [Notion API Reference](https://developers.notion.com/reference/intro)
- [Notion API Databases](https://developers.notion.com/docs/working-with-databases)

<br/><br/>

## 1. 안내

- 현재 마크다운 양식은 지원하고 있지 않습니다. (추후 지원될 수도 있습니다.)
- 노션 공식 API `2022-06-28` 버전을 사용합니다.
- 노션 자체적인 [request-limits](https://developers.notion.com/reference/request-limits) 제한 정책으로 인해, block 정보를 조회하는 과정에서 API 호출을 재시도할 수 있습니다.
- 모든 block 정보가 조회된 페이지는 캐싱하여 제공합니다.

<br/><br/>

## 2. 설정

### 2.1 설치

```sh
yarn add -D gatsby-source-notion-feely
```

or

```sh
npm install --save gatsby-source-notion-feely
```

<br/>

### 2.2 노션 키 발급받기

먼저 노션 API 호출을 위한 Secret Key와 연결할 데이터베이스 ID가 필요합니다. 아래는 발급 단계에 대한 간단한 설명으로 더 자세한 내용은 노션에서 제공하는 세부 가이드를 확인해주세요.

1. 노션에 로그인 후 새 Integration을 생성합니다. -> [Quick Link](https://www.notion.so/my-integrations)
   - 이미 사용 중인게 있다면, 이 단계는 건너뛰어도 좋습니다.
   - 더 자세한 내용은 [Notion Build your first integration Guide](https://developers.notion.com/docs/create-a-notion-integration#step-3-save-the-database-id)를 확인해주세요.
2. 노션에서 연결할 데이터베이스를 생성합니다.
3. 데이터베이스 - [Share] - [Invite] 에서 위에 생성했던 Integration을 초대합니다.
4. 데이터베이스 Key를 확인합니다
   - 더 자세한 내용은 [Notion Retrieve a database Guide](https://developers.notion.com/reference/retrieve-a-database)를 확인해주세요.
     > To find a database ID, navigate to the database URL in your Notion workspace. The ID is the string of characters in the URL that is between the slash following the workspace name (if applicable) and the question mark. The ID is a 32 characters alphanumeric string.

### 2.3 플러그인 설정하기

  ```javascript
    plugins: [
    {
      resolve: `gatsby-source-notion-feely`,
      options: {
        token: `$INTEGRATION_TOKEN`,
        databases: [
          {
            id: `$DATABASE_ID`,
            name: `$USE_ANY_UNIQUE_VALUE`,
          },
        ],
      },
    },
    ];
  ```

`gatsby-config.json`에 설정을 추가합니다.

### 2.4 GraphQL로 데이터 조회하기

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

이제 Gatsby에서 GraphQL로 데이터를 조회할 수 있습니다

- `JSON.parse(json)` 을 통해 Notion 페이지 객체를 이용할 수 있습니다.

<br/><br/>

## 3. 요청값

### `token`

type: `string`  
노션에서 발급받은 토큰 키 값 입니다.

### `databases`

type: `Array<Database>`

```typescript
arguments {
 id: string;
 name: string;
 pageFilter?: NotionFilterJSON;
}
```

- `id` : 노션 데이터베이스 ID
- `name` : 조회한 데이터베이스들에 대해 명시적 구분을 위해 사용할 이름
- `pageFilter` : 노션 데이터베이스 필터 쿼리 ([Filter database entries](https://developers.notion.com/reference/post-database-query-filter) 참고)

```js
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

<br/><br/>

## 4. 응답값

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

<br/><br/>

## 5. 삭제된 기능

v2.0.0에서 삭제되었습니다.

- 노션 데이터베이스 매개변수 중 `isCheckPublish` 값이 삭제되었습니다. checkbox 타입의 `is_published` 값을 판단할 수 있게 해주는 이 값은 `pageFilter`로 대체되어 더 폭넓은 필터링을 지원할 수 있게 수정되었습니다.

<br/><br/>

## 6. 테스트

Jest를 사용하고 있으며, `/test/gatsby-node.test.js` 파일이 실행됩니다.

1. `.env.test` 환경변수 파일을 추가합니다.
2. `NOTION_INTEGRATION_TOKEN`, `NOTION_DB_ID` 환경변수를 설정합니다.
3. `yarn test` 를 실행합니다.

### Gatsby Unit Test 참고

- [Gatsby Unit Testing](https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/)

<br/><br/>

## 7. Contributing

더 멋진 기능을 위한 이슈 생성과 PR을 기다리고 있습니다.

### License

gatsby-source-notion-feely is [0BSD](./LICENSE).

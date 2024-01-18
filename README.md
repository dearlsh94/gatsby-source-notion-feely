<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" alt="Gatsby logo" />
  </a>
</p>
<h1 align="center">
  gatsby-source-notion-feely
</h1>
<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-0BSD-purple.svg" alt="GitHub license"/>
  </a>
  <a href="https://www.npmjs.com/package/gatsby-source-notion-feely">
    <img src="https://img.shields.io/npm/v/gatsby-source-notion-feely.svg?style=flat" alt="npm version"/>
  </a>
<p>

<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img src="https://img.shields.io/badge/Gatsby-663399?logo=gatsby&logoColor=fff" alt="Gatsby Badge"/>
  </a>
  <a href="https://notion.so">
    <img src="https://img.shields.io/badge/Notion-fff?logo=notion&logoColor=000" alt="Notion Badge"/>
  </a>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000" alt="JavaScript Badge"/>
</p>

<!-- <p align="center">
  <a href="./README.md">[English]</a>
  &middot;
  <a href="/docs/README_KR.md">[한국어]</a>
</p> -->

Gatsby + Notion = ✨

## 0. 목차

- [0. 목차](#0-목차)
- [1. 소개](#1-소개)
  - [1.1. 이용 사례](#11-이용-사례)
  - [1.2. Notion API 공식문서](#12-notion-api-공식문서)
- [2. 기능 안내](#2-기능-안내)
  - [2.1. 지원하는 페이지 block](#21-지원하는-페이지-block)
  - [2.2. 로드맵](#22-로드맵)
- [3. 사용 방법](#3-사용-방법)
  - [3.1. 설치](#31-설치)
  - [3.2. 연동을 위한 키 발급받기](#32-연동을-위한-키-발급받기)
  - [3.3. 플러그인 설정하기](#33-플러그인-설정하기)
  - [3.4. 플러그인 설정 활용 예시](#34-플러그인-설정-활용-예시)
  - [3.5. GraphQL로 데이터 조회하기](#35-graphql로-데이터-조회하기)
- [4. 설정값](#4-설정값)
- [5. 응답값](#5-응답값)
- [6. 삭제된 기능](#6-삭제된-기능)
- [7. 테스트](#7-테스트)
  - [7.1. Gatsby Unit Test 참고](#71-gatsby-unit-test-참고)
- [8. 기여](#8-기여)
- [9. 라이선스](#9-라이선스)
  
## 1. 소개

Notion에 아카이빙한 문서들을 Gatsby 정적 블로그로 서비스하기 위해 개발된 플러그인입니다.

손쉽게 Gatsby에서 GraphQL로 Notion 데이터베이스를 조회할 수 있습니다.

Gatsby 정적 사이트의 CMS로 Notion을 생각하셨다면, 이 플러그인이 도움이 될 수 있을 것입니다.

1개의 Notion 계정만 연결이 가능하며, 해당 계정 내의 여러 데이터베이스와 연결할 수 있습니다.

> [orlowdev/gatsby-source-notion-api](https://github.com/orlowdev/gatsby-source-notion-api) 플러그인을 fork하여 개발되었습니다.

### 1.1. 이용 사례

> 이용 사례에 등록을 원하실 경우 [Use Case Issue](https://github.com/dearlsh94/gatsby-source-notion-feely/issues/new?assignees=dearlsh94&labels=use&projects=&template=use-case.md&title=%5BUse%5D)로 등록해주세요.

- [Weezip](https://weezip.treefeely.com) 블로그 서비스에서 사용하고 있습니다.

### 1.2. Notion API 공식문서

Notion API를 사용하고 있으므로 아래 문서를 참고하시면 좋습니다.

- [Notion API Reference](https://developers.notion.com/reference/intro)
- [Notion API Databases](https://developers.notion.com/docs/working-with-databases)

<br/><br/>

## 2. 기능 안내

- Notion 공식 API `2022-06-28` 버전을 사용합니다.
- Notion 데이터베이스 API의 페이지 필터 기능을 이용할 수 있습니다.
- Notion 자체적인 [request-limits](https://developers.notion.com/reference/request-limits) 제한 정책으로 인해, block 정보를 조회하는 과정에서 API 호출을 재시도할 수 있습니다.
- 모든 block 정보가 조회된 페이지는 캐싱하여 제공합니다.

### 2.1. 지원하는 페이지 block

조회 가능한 응답 및 자세한 block 구조는 [Notion A block object](https://developers.notion.com/reference/block)에서 더 자세히 확인하실 수 있습니다.
  
### 2.2. 로드맵

- 마크다운 양식을 지원할 예정입니다.

<br/><br/>

## 3. 사용 방법

### 3.1. 설치

```sh
yarn add gatsby-source-notion-feely
```

or

```sh
npm install --save gatsby-source-notion-feely
```

### 3.2. 연동을 위한 키 발급받기

먼저 Notion API 호출을 위한 Key와 연결할 데이터베이스 ID가 필요합니다. 아래는 발급 단계에 대한 간단한 설명으로 [Notion Build your first integration](https://developers.notion.com/docs/create-a-notion-integration)에서 더 자세히 확인하실 수 있습니다.

1. Notion에 로그인 후 새 Integration을 생성합니다. -> [바로가기](https://www.notion.so/my-integrations)
   - 이미 사용 중인 Key가 있다면, 이 단계는 생략될 수 있습니다.
   - [Notion Create your integration in Notion](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion)에서 더 자세히 확인하실 수 있습니다.
  ![Navigating the integrations dashboard to create a new internal integration.](https://files.readme.io/90c7d2e-integration.gif)
2. Notion에서 연결할 데이터베이스를 생성합니다.
   - 이미 생성한 데이터베이스가 있다면, 이 단계는 생략될 수 있습니다.
3. 연결할 페이지에서 위에 생성한 Integration을 연결합니다.
   - [Pick Page] - [...(More)] - [+ Add Connections] - Integration 선택
   - 데이터베이스가 포함된 페이지에서 Integration을 연결할 경우, 하위 페이지들에도 자동으로 적용됩니다.
   - [Notion Give your integration page permissions](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)에서 더 자세히 확인하실 수 있습니다.
  ![Give your integration permission to add a database to a page.](https://files.readme.io/fefc809-permissions.gif)
4. 데이터베이스 ID를 확인합니다.
   - 반드시 데이터베이스가 포함된 페이지가 아닌, 데이터베이스 페이지에서 확인해야합니다.
   - [Notion Retrieve a database Guide](https://developers.notion.com/reference/retrieve-a-database)에서 더 자세히 확인하실 수 있습니다.
      ![Notion database ID](https://files.readme.io/64967fd-small-62e5027-notion_database_id.png)
      > To find a database ID, navigate to the database URL in your Notion   workspace. The ID is the string of characters in the URL that is between the slash following the workspace name (if applicable) and the question mark. The ID is a 32 characters alphanumeric string.

<br/>
여러 데이터베이스를 연결하는 경우에는 모든 데이터베이스에 대해 3번과 4번 작업을 진행해야합니다.
  
### 3.3. 플러그인 설정하기

  ```javascript
    plugins: [
      {
        resolve: `gatsby-source-notion-feely`,
        options: {
          token: `{YOUR__INTEGRATION__KEY}`,
          databases: [
            {
              id: `{YOUR__DATABASE__ID}`,
              name: `{ANY__NAME__VALUE}`,
            },
          ],
        },
      },
    ];
  ```

`gatsby-config.js`에 설정을 추가합니다. 설정 관련 더 자세한 내용은 뒤의 [4. 설정값](#4-설정값) 섹션을 확인해주세요.

### 3.4. 플러그인 설정 활용 예시

```js
plugins: [
  {
    resolve: `gatsby-source-notion-feely`,
    options: {
      token: `ItsMyIntegrationKey`,
      databases: [
        {
          id: `ItsFirstDataBaseID`,
          name: `blog`,
          pageFilter: {
            property: "is_published",
            checkbox: {
              equals: true,
            },
          },
        },
        {
          id: `ItsSecondDataBaseID`,
          name: `archive`,
          option: {
            isIncludeChildren: false
          }
        },
      ],
    },
  },
];
```

1. 노션에서 발급받은 Integration Key인 `ItsMyIntegrationKey`를 `token`으로 전달해 Notion 연결을 진행합니다.
2. `ItsFirstDatabaseID` 데이터베이스를 조회합니다.
   1. 이 데이터베이스의 이름은 `blog`로 설정합니다.
   2. Notion API 필터를 적용해 `is_published` 체크박스가 선택된 페이지만 조회합니다.
3. `ItsSecondDataBaseID` 데이터베이스를 조회합니다.
   1. 이 데이터베이스의 이름은 `archive`로 설정합니다.
   2. 페이지 내 하위 블럭은 조회하지 않고, 페이지 정보만 조회합니다.

### 3.5. GraphQL로 데이터 조회하기

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

이제 Gatsby에서 GraphQL로 데이터를 조회할 수 있습니다.

- `JSON.parse(json)` 을 통해 Notion 페이지 객체를 이용할 수 있습니다.

<br/><br/>

## 4. 설정값

```typescript
interface Options {
  token: string;
  databases: Array<{
    id: string;
    name: string;
    pageFilter?: NotionFilterJSON;
    option?: {
      isIncludeChildren?: boolean
    }
  }>
}
```

| Field               | Type    | Description | Default |
|---------------------|---------|--------------------------------------|---------|
| `token`             | string  | Notion에서 발급받은 토큰 키. | |
| `databases`         | Array   | 연결할 Notion 데이터베이스 정보 배열. | |
| &nbsp;&nbsp;`id`    | string  | `databases` 내부 객체의 하위 필드.<br/>Notion 데이터베이스 ID.  | |
| &nbsp;&nbsp;`name`  | string  | `databases` 내부 객체의 하위 필드.<br/>데이터베이스들의 명시적 구분을 위해 사용할 이름.  | |
| &nbsp;&nbsp;`pageFilter` | | `databases` 내부 객체의 하위 필드.<br/> 데이터베이스 필터 쿼리.<br/>[Filter database entries](https://developers.notion.com/reference/post-database-query-filter) 참조.  | `undefined` |
| &nbsp;&nbsp;`option`| | `databases` 내부 객체의 하위 필드.<br/>추가 옵션 설정.  | |
| &nbsp;&nbsp;&nbsp;&nbsp;`isIncludeChildren` | boolean | `option` 객체의 하위 필드.<br/>`true`일 경우, 데이터베이스 페이지 내 하위 블럭까지 조회. <br/>`false`일 경우, 데이터베이스 페이지만 조회.  | `true` |

<br/><br/>

## 5. 응답값

```typescript
interface Response {
  id: string;
  parent: null;
  children: [];
  databaseName: string;
  title: string;
  json: string;
  createdAt: string;
  updateAt: string;
}
```

| Field          | Type   | Description |
|--------------|--------|-------------|
| `id`           | string | 페이지마다 생성된 Gatsby 노드 ID.<br/>[Gatsby 공식 문서](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNode)에서 더 자세히 확인하실 수 있습니다. |
| `parent`       | null   | 부모 노드 ID.<br/>최상위 노드이기 때문에 `null`로 지정됩니다. |
| `children`     | []     | 자식 노드 ID의 배열.<br/>자식 노드를 가지지 않기 때문에 `[]`로 지정됩니다. |
| `databaseName` | string | 플러그인 연결 시 설정한 데이터베이스 이름. |
| `title`        | string | 데이터베이스의 `title`로 설정된 컬럼의 정보. |
| `json`         | string | 페이지 정보를 JSON string으로 변환한 정보.<br/>[Notion API 공식 문서](https://developers.notion.com/reference/database)에서 더 자세히 확인하실 수 있습니다. |
| `createdAt`    | string | 데이터베이스가 생성된 ISO 8601 형식의 날짜 및 시간. |
| `updatedAt`    | string | 데이터베이스가 마지막으로 변경된 ISO 8601 형식의 날짜 및 시간. |

<br/><br/>

## 6. 삭제된 기능

v2.0.0에서 삭제되었습니다.

- Notion 데이터베이스 매개변수 중 `isCheckPublish` 값이 삭제되었습니다.
  - checkbox 타입의 `is_published` 값을 판단할 수 있게 해주는 이 값은 `pageFilter`로 대체되어 더 폭넓은 필터링을 지원할 수 있게 되었습니다.

<br/><br/>

## 7. 테스트

Jest를 사용하고 있으며, `/test/gatsby-node.test.js` 파일이 실행됩니다.

1. `.env.test` 환경변수 파일을 추가합니다.
2. `NOTION_INTEGRATION_TOKEN`, `NOTION_DB_ID` 환경변수를 설정합니다.
3. `yarn test` 를 실행합니다.

### 7.1. Gatsby Unit Test 참고

- [Gatsby Unit Testing](https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/)

<br/><br/>

## 8. 기여

더 멋진 기능을 위한 이슈 생성과 PR을 기다리고 있습니다.

<br/><br/>

## 9. 라이선스

gatsby-source-notion-feely is [0BSD](./LICENSE).

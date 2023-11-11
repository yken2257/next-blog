import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types'; // https://github.com/algolia/autocomplete/tree/next/examples/react-instantsearch-hooks#demo

// matterResult.data の型
export type MatterData = {
  date: string;
  title: string;
  [key: string]: any;
};

// allPostsData の戻り値
export type PostMetaData = {
  slug: string;
} & MatterData;

export type AlgoliaIndexData = {
  objectID: string;
  title: string;
  date: string;
  description?: string;
  content: string;
};

// getPostData の戻り値
export type PostData = {
  contentHtml: string;
  contentText?: string;
} & MatterData;

export type AlgoliaHitProps = {
  hit: AlgoliaHit<AlgoliaIndexData>;
};
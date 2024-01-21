"use client";
import Link from 'next/link';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import type { AlgoliaHitProps } from '@/utils/types';
import {
  MultipleQueriesResponse,
  MultipleQueriesQuery,
} from "@algolia/client-search";
import type { SearchClient } from "instantsearch.js";

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
);
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_PRIMARY_INDEX || '';

const searchClient: SearchClient = {
  ...algoliaClient,
  search: <SearchResponse,>(requests: Readonly<MultipleQueriesQuery[]>) => {
    if (requests.every(({ params }: MultipleQueriesQuery) => {
      return !params?.query || params.query.length < 2
    })
    ) {
      return Promise.resolve<MultipleQueriesResponse<SearchResponse>>({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: '',
          params: '',
        })),
      });
    }
    return algoliaClient.search(requests);
  },
};

function Hit({ hit }: AlgoliaHitProps): JSX.Element {
  const url = `/posts/${hit.objectID}`;
  return (
    <div>
      <Link href={url}>{hit.title}</Link>
    </div>
  );
}

export default function Search(): JSX.Element {
  return (
    <div>
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <SearchBox />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
}
"use client";
import Link from 'next/link';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';

type HitProps = {
  hit: AlgoliaHit<{
    objectID: string;
    title: string;
    content: string;
    date: string;
  }>;
};

function Hit({ hit }: HitProps) {
  const url = `/posts/${hit.objectID}`;
  return (
    <div>
      <Link href={url}>{hit.title}</Link>
    </div>
  );
}

export default function Search(): JSX.Element {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID || '',
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
  );
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_PRIMARY_INDEX || '';

  return (
    <div>
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <SearchBox />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
}
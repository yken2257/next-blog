import type { ReactElement } from 'react'
import cn from 'clsx'
import Link from 'next/link';

export type TOCProps = {
  headings: []
};

export default function TOC({headings}: TOCProps): ReactElement {

  return (
    <>
      {headings.map(({ id, value, depth }) => (
        <li 
          key={id} 
          className={
            cn({
                2: '',
                3: 'ps-4',
                4: 'ps-8',
                5: 'ps-12',
                6: 'ps-16'
              }[depth as Exclude<typeof depth, 1>],
              'list-none',
            )
          }
        >
          <Link href={`#${id}`}>
            {value}
          </Link>
        </li>
      ))}
    </>
  );
}
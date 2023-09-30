import type { Metadata } from 'next'
import * as prod from 'react/jsx-runtime'
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { getAllPostIds, getPostData, getPostMetaData } from "@/utils/posts"
import { PostData } from "@/utils/types";
import CustomLink from '@/app/components/CustomLink';
import FormattedDate from '@/app/components/FormattedDate';
import { FaRegClock } from 'react-icons/fa6';


export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const postMetaData = await getPostMetaData(params.slug);
  
  return {
    title: postMetaData.title,
    description: postMetaData.description ? postMetaData.description : postMetaData.title
  }
}

// @ts-expect-error: the react types are missing.
const production = {createElement: prod.createElement, Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs, }

const processor = unified()
  .use(rehypeParse, { fragment: true }) 
  // @ts-ignore
  .use(rehypeReact, {...production, components: { a: CustomLink, }});

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const postData: PostData = await getPostData(slug);

  return (
    <>
      <article>
        <h1>
          {postData.title}
        </h1>
        <div className="text-gray-500 text-base mb-2 flex items-center">
          <FaRegClock className="mr-1"/>
          <FormattedDate dateString={postData.date} />
        </div>
        <hr className="mb-4"/>
        {processor.processSync(postData.contentHtml).result}
      </article>
    </>
  )
}

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths
}
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkToc from 'remark-toc';
// import { toc, Options } from 'mdast-util-toc';
import { PostMetaData, MatterData, PostData, AlgoliaIndexData } from './types';
import { fromMarkdown } from 'mdast-util-from-markdown';
import removeMarkdown from 'remove-markdown'
import Slugger from 'github-slugger'

const postsDirectory = path.join(process.cwd(), 'posts');

// Return a list of file names (excluding .md) in the posts directory
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ''),
  }));
}

// Return a list of sorted posts data (sorted by date)
export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: PostMetaData[] = fileNames.map((fileName) => {
    // Remove ".md" from file name to get slug
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      slug,
      ...matterResult.data as MatterData,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Return a list of raw text data
export async function getRawContentsForAlgolia() {
  const fileNames = fs.readdirSync(postsDirectory);
  const indexData: AlgoliaIndexData[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const rawText = removeMarkdown(matterResult.content);
    const contentText = rawText.replace(/[\n\t]/g, ' ');
    return {
      objectID: slug,
      content: contentText,
      ...matterResult.data as MatterData,
    };
  });
  return indexData;
}

interface MyGrayMatterFile extends Omit<matter.GrayMatterFile<string>, 'data'> {
  data: MatterData;
}

export async function getPostMetaData(slug: string): Promise<MatterData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents) as MyGrayMatterFile;
  return {
    ...matterResult.data
  };
}

// Remark plugin to extract TOC headings
// const getToc = (options: Options) => {
//   return (tree: any) => {
//     const result = toc(tree, options);

//     tree.children = [
//       result.map,
//     ]
//   };
// };

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents) as MyGrayMatterFile;

  // Use remark to convert markdown into HTML string
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const rawText = removeMarkdown(matterResult.content);
  const contentText = rawText.replace(/[\n\t]/g, ' ');

  // Generate TOC html string
  // const toc = await unified()
  //   .use(remarkParse)
  //   .use(getToc, {
  //     tight: true,
  //   })
  //   .use(remarkRehype)
  //   .use(rehypeStringify)
  //   .process(matterResult.content);
  // const tocString = toc.toString()

  const slugger = new Slugger();
  const extractHeadings: any = (node: any) => {
    const headings = [];
  
    if (node.type === 'heading') {
      const value = node.children[0].value;
      const depth = node.depth;
      const id = slugger.slug(value);
      headings.push({ id, value, depth });
    }
  
    if (node.children) {
      for (let child of node.children) {
        headings.push(...extractHeadings(child));
      }
    }
  
    return headings;  
  };

  const markdownTree = fromMarkdown(matterResult.content);
  const headings = extractHeadings(markdownTree)
  
  // Combine the data with the id
  return {
    contentHtml,
    headings,
    contentText,
    ...matterResult.data,
  };
}
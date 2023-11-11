import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import 'dotenv/config';
import removeMarkdown from 'remove-markdown'
import { MatterData, AlgoliaIndexData } from './types';
import algoliasearch from 'algoliasearch';

const postsDirectory = path.join(process.cwd(), 'posts');

const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string,
  process.env.ALGOLIA_ADMIN_API_KEY as string,
)

const index = algolia.initIndex(
  process.env.NEXT_PUBLIC_ALGOLIA_PRIMARY_INDEX as string,
)

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

async function syncAlgolia() {
  const res = await getRawContentsForAlgolia();
  console.log(res);

  try {
    await index.saveObjects(res);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

syncAlgolia();
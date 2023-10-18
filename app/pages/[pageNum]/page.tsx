import { getSortedPostsData } from '@/utils/posts'
import PostCard from '@/app/components/PostsCard';
import Pagination from '@/app/components/Pagenation';

const ITEMS_SIZE = 5;

export default async function Page({ params }: { params: { pageNum: number } }) {
  const allPostsData = await getSortedPostsData();
  const currentPage = params.pageNum;
  const maxPageNum = Math.ceil(allPostsData.length / ITEMS_SIZE)

  const slicedPosts = allPostsData.slice(
    ITEMS_SIZE * (currentPage - 1),
    ITEMS_SIZE * currentPage
  );

  return (
    <>
      <h2>Posts</h2>
      {slicedPosts.map(({slug, date, title}) => (
        <PostCard key={slug} title={title} slug={slug} date={date}/>
      ))}
      <Pagination maxPageNum={maxPageNum} currentPageNum={currentPage} />
    </>
  )
}
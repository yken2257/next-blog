import Image from 'next/image';
import { getSortedPostsData } from '@/utils/posts'
import PostCard from './components/PostsCard';

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <>
      <Image      
        src="/images/hero.jpg"
        width={1100}
        height={420}
        priority={true}
        alt="Picture of the author"
      />
      <p className="mt-2">とあるエンジニアの備忘録です。</p>
      <h2>Posts</h2>
      {allPostsData.map(({slug, date, title}) => (
        <PostCard key={slug} title={title} slug={slug} date={date}/>
      ))}
    </>
  )
}

import Link from "next/link";
import { PostMetaData } from "@/utils/types";
import FormattedDate from "./FormattedDate";
import { FaRegClock } from 'react-icons/fa6';

export default function PostCard(PostMetaData: PostMetaData) {
  const {title, slug, date, description} = PostMetaData;

  return (
    <div className="rounded-md overflow-hidden border border-gray-200 my-4">
      <div className="px-4 py-2 font-bold text-xl mb-0 hover:underline">
        <Link className="text-gray-900" href={`/posts/${slug}/`}>
          {title}
        </Link>
      </div>
      <div className="text-gray-500 text-base mb-2 px-4 flex items-center">
        <FaRegClock className="mr-1"/>
        <FormattedDate dateString={date} />
        <p className="text-gray-800 text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
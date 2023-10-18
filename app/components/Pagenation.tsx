import Link from 'next/link';

const Pagination = ({ maxPageNum, currentPageNum = 1 }) => {
  const pageNumArray = Array.from({ length: maxPageNum }, (_, i) => i + 1);

  return (
    <div className="flex items-center space-x-1 mt-8">
      {pageNumArray.map((page) => (
        <Link 
          href={`/pages/${page}`} 
          key={page}
          className={`px-4 py-2 border hover:bg-sky-900 hover:text-white ${
            currentPageNum == page && 'bg-sky-900 text-white'
          }`}
        >
          {page}
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
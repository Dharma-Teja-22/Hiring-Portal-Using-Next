
import Link from 'next/link';

function NotFound() {
  return (
    <div>
      <div className="flex items-center h-full p-16 dark:bg-gray-50 dark:text-gray-800">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center">
            <h2 className="mb-6 font-extrabold text-9xl dark:text-gray-400 ">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-xl font-semibold md:text-2xl ">
              Sorry, we couldn&apos;t find this page.
            </p>
            <p className="mt-4 mb-8 dark:text-gray-600 ">
              But don&apos;t worry, you can find plenty of other things on our homepage.
            </p>
            <Link href="/" className="px-8 py-3 font-semibold rounded dark:bg-violet-80000 dark:text-gray-50">
            ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;


import Link from 'next/link';

function page() {
  return (
    <div className="absolute flex gap-20 pt-4 justify-end font-medium w-full pr-20 text-white">
      <ul className="flex gap-20 pt-4 justify-end font-medium w-full pr-12 text-white">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About Us</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/signup">Sign Up</Link>
        </li>
        <li>
          <Link href="/contact">Contact Us</Link>
        </li>
      </ul>
    </div>
  );
}

export default page;

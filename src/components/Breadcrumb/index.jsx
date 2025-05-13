import Link from "next/link";
import { HiHome } from "react-icons/hi";

const Breadcrumb = ({ paths }) => {
  return (
    <div className="w-full bg-[#f8f9fa] border-b">
      <div className="container mx-auto px-4 py-3 text-sm text-gray-700">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/"
              className="text-blue-600 hover:underline flex items-center"
            >
              <HiHome className="mr-1" /> Home
            </Link>
          </li>
          {paths.map((path, index) => (
            <li key={index} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {index === paths.length - 1 ? (
                <span className="text-gray-500">{path.label}</span>
              ) : (
                <Link
                  href={path.href}
                  className="text-blue-600 hover:underline"
                >
                  {path.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Breadcrumb;

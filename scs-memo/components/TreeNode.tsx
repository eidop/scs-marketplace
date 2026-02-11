import Link from "next/link";

interface TreeNodeProps {
  title: string;
  description: string;
  href: string;
  level?: number;
}

export default function TreeNode({
  title,
  description,
  href,
  level = 0
}: TreeNodeProps) {
  return (
    <Link
      href={href}
      className={`
        block px-4 py-3 rounded-lg border transition-colors
        ${level === 0
          ? 'border-gray-700 hover:border-gray-500'
          : 'border-gray-800 hover:border-gray-600 ml-4'
        }
      `}
    >
      <div className="font-medium">
        {title}
      </div>
      {description && (
        <div className="text-sm text-gray-500 mt-1">
          {description}
        </div>
      )}
    </Link>
  );
}

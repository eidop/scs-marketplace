import Link from "next/link";

interface TreeBranchProps {
  title: string;
  description: string;
  href: string;
  level: number;
  children?: TreeBranchProps[];
}

export default function TreeBranch({
  title,
  description,
  href,
  level,
  children
}: TreeBranchProps) {
  return (
    <div className="space-y-3">
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

      {children && (
        <div className="ml-4 border-l-2 border-gray-800 pl-4 space-y-3">
          {children.map((child, index) => (
            <TreeBranch
              key={index}
              {...child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}


import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: Breadcrumb[];
  showHome?: boolean;
}

export function BreadcrumbNav({ items, showHome = true }: BreadcrumbNavProps) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap space-x-2">
        {showHome && (
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-insightRed transition-colors inline-flex items-center">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}
        
        {showHome && items.length > 0 && (
          <li>
            <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </li>
        )}
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
            )}
            
            {item.href && index !== items.length - 1 ? (
              <Link to={item.href} className="text-gray-500 hover:text-insightRed transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-insightBlack">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

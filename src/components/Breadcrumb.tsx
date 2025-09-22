import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (pathname: string) => {
    const breadcrumbMap: { [key: string]: string } = {
      'document-feed': 'Document Feed',
      'communication': 'Communication',
      'audit': 'Audit Traceability',
      'profile': 'Profile',
      'settings': 'Settings',
      'help': 'Help & Support',
    };
    return breadcrumbMap[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <Link to="/" className="flex items-center hover:text-gray-700">
        <Home className="w-4 h-4" />
        <span className="ml-1">Dashboard</span>
      </Link>
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <React.Fragment key={pathname}>
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-gray-900 font-medium">
                {getBreadcrumbName(pathname)}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-gray-700">
                {getBreadcrumbName(pathname)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

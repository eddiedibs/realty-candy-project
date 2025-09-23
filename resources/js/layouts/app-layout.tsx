import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300">
            {/* <Navbar /> */}
            <main className="pt-4 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
};

export default AppLayout;

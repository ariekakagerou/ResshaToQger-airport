"use client";
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from './ChatWidget';

export default function MainLayout({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isAuth = pathname?.startsWith('/auth');
    const shouldHideHeaderFooter = isAdmin || isAuth;

    return (
        <>
            {!shouldHideHeaderFooter && <Header />}
            <main style={shouldHideHeaderFooter ? { flex: 1, display: 'flex', flexDirection: 'column' } : { marginTop: 'var(--header-height)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </main>
            {!shouldHideHeaderFooter && (
                <>
                    <ChatWidget />
                    <Footer />
                </>
            )}
        </>
    );
}

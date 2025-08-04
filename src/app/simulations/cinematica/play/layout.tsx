import LayoutContainer from '@/components/layout/LayoutContainer';

function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <LayoutContainer showHeader={false}>{children}</LayoutContainer>;
}

export default Layout;

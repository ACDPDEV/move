import LayoutContainer from "@/components/layout/LayoutContainer";

function Layout({ children }: Readonly<{ 
    children: React.ReactNode;
}>) {
    return (
        <LayoutContainer>
            {children}
        </LayoutContainer>
    );
}

export default Layout;
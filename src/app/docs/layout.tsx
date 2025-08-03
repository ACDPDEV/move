import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { RootProvider } from 'fumadocs-ui/provider';

function Layout({ children }: { children: ReactNode }) {
    return (
        <RootProvider>
            <DocsLayout tree={source.pageTree} {...baseOptions}>
                {children}
            </DocsLayout>
        </RootProvider>
    );
}

export default Layout;

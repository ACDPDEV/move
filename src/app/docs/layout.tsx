import LayoutContainer from "@/components/layout/LayoutContainer";
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';

function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions}>
        <LayoutContainer>
            {children}
        </LayoutContainer>
    </DocsLayout>
  );
}

export default Layout;
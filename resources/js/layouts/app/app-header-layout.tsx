// import { AppContent } from '@/components/app-content';
// import { AppHeader } from '@/components/app-header';
// import { AppShell } from '@/components/app-shell';
// import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function AppHeaderLayout({ children }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <div>
            {/* <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
        </AppShell> */}
            {children}
        </div>
    );
}

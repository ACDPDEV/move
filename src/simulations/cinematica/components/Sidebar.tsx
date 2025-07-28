'use client';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react';
import EntityCard from './EntityCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEntityStore } from '../stores/useEntityStore';
import { useEntitySummaries } from '../hooks/useEntityISummaries';

function Sidebar() {
    const entities = useEntitySummaries();
    const reversedEntities = [...entities].reverse();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 z-50"
                >
                    <IconLayoutSidebarLeftCollapseFilled />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <ScrollArea className="w-full h-full flex flex-col gap-4 p-4">
                    <SheetTitle className="mb-4">Entidades</SheetTitle>
                    <Button
                        onClick={() => useEntityStore.getState().addEntity()}
                        className="mb-4"
                    >
                        Añadir Móvil
                    </Button>
                    <div className="w-full h-full flex flex-col gap-4 p-4">
                        {reversedEntities.map(({ id, color }) => (
                            <EntityCard entityId={id} color={color} key={id} />
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

export default Sidebar;

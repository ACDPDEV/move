'use client';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react';
import EntityCard from './EntityCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEntityStore } from '../store/useEntityStore';
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
                <SheetHeader className="mb-4">
                    <SheetTitle>Móviles</SheetTitle>
                    <SheetDescription>
                        Añade móviles a la simulación
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="w-full h-full flex flex-col gap-4 p-4">
                    <Button
                        onClick={() => useEntityStore.getState().addEntity()}
                        className="mb-4"
                    >
                        Añadir Móvil
                    </Button>
                    <div className="flex flex-col gap-4">
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

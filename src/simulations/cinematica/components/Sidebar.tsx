'use client'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react';
import { Card, CardContent } from '@/components/ui/card';
import EntityForm from './EntityForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEntityStore } from '../store/useEntityStore';

function Sidebar() {
    const { entities } = useEntityStore();
    const reverseEntities = [...entities].reverse();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="absolute top-4 right-4 z-50" >
                    <IconLayoutSidebarLeftCollapseFilled />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="mb-4">
                    <SheetTitle>Móviles</SheetTitle>
                    <SheetDescription>Añade móviles a la simulación</SheetDescription>
                </SheetHeader>
            
                <ScrollArea className="w-full h-full flex flex-col gap-4 p-4">
                    <Button onClick={() => useEntityStore.getState().addEntity({
                        position: { x: 100, y: 300 },
                        velocity: { x: 100, y: 0 },
                        acceleration: { x: 0, y: 0 },
                        radius: 10,
                        color: '#FFFFFF',
                    })} className="mb-4">
                        Añadir Móvil
                    </Button>
                    <div className="flex flex-col gap-4">
                        {reverseEntities.map((entity) => (
                            <Card key={entity.id}>
                                <CardContent>
                                    <EntityForm entity={entity} />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

export default Sidebar;
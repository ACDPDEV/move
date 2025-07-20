import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react';
import { useSimulationStore } from '../store/useSimulationStore';
import { Card, CardContent } from '@/components/ui/card';
import MobileForm from './MobileForm';
import { ScrollArea } from '@/components/ui/scroll-area';

function Sidebar() {
    const { entities } = useSimulationStore();
    const reverseEntities = [...entities].reverse();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="absolute top-4 right-4 z-50" >
                    <IconLayoutSidebarLeftCollapseFilled />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <Button onClick={() => useSimulationStore.getState().addEntity('mobile')} className="mb-4">
                    Añadir Móvil
                </Button>
                <ScrollArea className="w-full h-full flex flex-col gap-4">
                    {reverseEntities.map((entity) => (
                        <Card key={entity.id!}>
                            <CardContent>
                                <MobileForm entity={entity} />
                            </CardContent>
                        </Card>
                    ))}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

export default Sidebar;
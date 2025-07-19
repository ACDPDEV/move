import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react';
import { useSimulationStore } from '../store/useSimulationStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

// zod schema
const schema = z.object({
    radius: z.number().min(5).max(50).optional(),
    color: z.string().optional(),
    position: z.object({
        x: z.number().min(-1000).max(1000).optional(),
        y: z.number().min(-1000).max(1000).optional(),
    }).optional(),
    velocity: z.object({
        x: z.number().min(-1000).max(1000).optional(),
        y: z.number().min(-1000).max(1000).optional(),
    }).optional(),
    acceleration: z.object({
        x: z.number().min(-1000).max(1000).optional(),
        y: z.number().min(-1000).max(1000).optional(),
    }).optional(),
});

function Sidebar() {
    const { entities, updateEntity, updateEntities } = useSimulationStore();
    const reverseEntities = [...entities].reverse();

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="outline" size="icon" className="absolute top-4 right-4 z-50">
                    <IconLayoutSidebarLeftCollapseFilled size={24} />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                    {reverseEntities.map((entity, index) => (
                        <Card key={entity.id || index}>
                            <CardContent>
                                <Input 
                                    type="text"
                                    value={entity.radius}
                                    onInput={(e) => {
                                        const val = (e.target as HTMLInputElement).value;
                                        updateEntity(entity.id!, { radius: Number(val) });
                                    }}
                                    onBlur={(e) => {
                                        const val = (e.target as HTMLInputElement).value;
                                        if (val !== "" && !isNaN(Number(val))) {
                                            updateEntity(entity.id!, { radius: Number(val) });
                                        }
                                    }}
                                    className="w-full px-2 py-1 bg-stone-700 border border-stone-600 rounded text-white text-sm focus:outline-none focus:border-stone-500 [&::-webkit-inner-spin-button]:hidden"
                                    min="5"
                                    max="50"
                                    step="1"
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default Sidebar;
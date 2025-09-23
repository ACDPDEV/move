import { IconTrash } from '@tabler/icons-react';
import { useEntityStore } from '../../stores/useEntityStore';
import Button from '@/components/ui/better-button';
import styles from '../../consts/styles';
import { useURL } from '../../hooks/useURL';
import { compressData } from '../../utils/encodeAndDecodeEntities';

function DeleteEntityButton({ entityId }: { entityId: string }) {
    const { setURLParams } = useURL();
    const deleteThisEntity = () =>
        useEntityStore.getState().deleteEntity(entityId);
    const onClick = () => {
        deleteThisEntity();
        setURLParams({
            d: compressData(useEntityStore.getState().entities),
        });
    };
    return (
        <Button
            onClick={onClick}
            tooltip="Eliminar Móvil"
            className="bg-[#712828]"
        >
            <IconTrash className={styles.icon + ' ' + 'text-[#CA6868]'} />
        </Button>
    );
}

export default DeleteEntityButton;

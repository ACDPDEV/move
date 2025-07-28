import { useDisplayStore } from '../stores/useDisplayStore';
import { useEntityStore } from '../stores/useEntityStore';

function drawEntities(ctx: CanvasRenderingContext2D): void {
    const entities = useEntityStore.getState().entities;

    entities.forEach((entity) => {
        entity.draw(ctx);
        if (useDisplayStore.getState().trajectory) {
            entity.drawTrajectory(ctx);
        }
        if (useDisplayStore.getState().position.resultant) {
            entity.drawPositionVectorResultant(ctx);
        }
        if (useDisplayStore.getState().position.components) {
            entity.drawPositionVectorComponents(ctx);
        }
        if (useDisplayStore.getState().position.angle) {
            entity.drawPositionVectorAngle(ctx);
        }
        if (useDisplayStore.getState().velocity.resultant) {
            entity.drawVelocityVectorResultant(ctx);
        }
        if (useDisplayStore.getState().velocity.components) {
            entity.drawVelocityVectorComponents(ctx);
        }
        if (useDisplayStore.getState().velocity.angle) {
            entity.drawVelocityVectorAngle(ctx);
        }
        if (useDisplayStore.getState().acceleration.resultant) {
            entity.drawAccelerationVectorResultant(ctx);
        }
        if (useDisplayStore.getState().acceleration.components) {
            entity.drawAccelerationVectorComponents(ctx);
        }
        if (useDisplayStore.getState().acceleration.angle) {
            entity.drawAccelerationVectorAngle(ctx);
        }
    });
}

export { drawEntities };

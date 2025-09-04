import { useOptionsStore } from '../stores/useOptionsStore';
import { useEntityStore } from '../stores/useEntityStore';

function drawEntities(ctx: CanvasRenderingContext2D, dark: boolean): void {
    const entities = useEntityStore.getState().entities;

    entities.forEach((entity) => {
        if (useOptionsStore.getState().display.trajectory) {
            entity.drawTrajectory(ctx);
        }
        if (useOptionsStore.getState().display.positionVectorResultant) {
            entity.drawPositionVectorResultant(ctx);
        }
        if (useOptionsStore.getState().display.positionVectorComponents) {
            entity.drawPositionVectorComponents(ctx);
        }
        if (useOptionsStore.getState().display.positionVectorAngle) {
            entity.drawPositionVectorAngle(ctx);
        }
        if (useOptionsStore.getState().display.velocityVectorResultant) {
            entity.drawVelocityVectorResultant(ctx);
        }
        if (useOptionsStore.getState().display.velocityVectorComponents) {
            entity.drawVelocityVectorComponents(ctx);
        }
        if (useOptionsStore.getState().display.velocityVectorAngle) {
            entity.drawVelocityVectorAngle(ctx);
        }
        if (useOptionsStore.getState().display.accelerationVectorResultant) {
            entity.drawAccelerationVectorResultant(ctx);
        }
        if (useOptionsStore.getState().display.accelerationVectorComponents) {
            entity.drawAccelerationVectorComponents(ctx);
        }
        if (useOptionsStore.getState().display.accelerationVectorAngle) {
            entity.drawAccelerationVectorAngle(ctx);
        }
        entity.draw(
            ctx,
            useEntityStore.getState().selectedEntityId === entity.id
                ? dark
                    ? '#fff'
                    : '#000'
                : undefined,
        );
    });
}

export { drawEntities };

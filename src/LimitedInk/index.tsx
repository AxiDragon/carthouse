import { Canvas, PencilBrush, type TPointerEvent, type TPointerEventInfo, } from "fabric";
import ScalingCanvas, { type ScalingCanvasRef } from "../components/ScalingCanvas";
import { useRef, useState } from "react";

function LimitedInk() {
	const canvas = useRef<ScalingCanvasRef>(null);
	const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
	const maxInk = 250;
	const [ink, setInk] = useState<number>(maxInk);

	const onMouseMove = (e: TPointerEventInfo<TPointerEvent>) => {
		if (lastPositionRef.current && canvas.current?.isDrawing()) {
			const deltaX = e.viewportPoint.x - lastPositionRef.current.x;
			const deltaY = e.viewportPoint.y - lastPositionRef.current.y;

			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

			setInk(prevInk => {
				const newInk = prevInk - distance;
				if (newInk <= 0) {
					canvas.current!.getCanvas().isDrawingMode = false;
					return 0;
				} else {
					canvas.current!.getCanvas().freeDrawingBrush!.width = 8 * (newInk / maxInk);
					canvas.current!.getCanvas().freeDrawingBrush!.color = `rgba(0, 0, 0, ${newInk / maxInk})`;
				}

				return newInk;
			});
		}

		lastPositionRef.current = { x: e.viewportPoint.x, y: e.viewportPoint.y };
	}

	const init = (canvas: Canvas) => {
		canvas.freeDrawingBrush = new PencilBrush(canvas);
		canvas.freeDrawingBrush.width = 8;
		canvas.freeDrawingBrush.color = 'black';

		canvas.on('mouse:move', onMouseMove);
	}

	return (
		<div>
			<p style={{
				position: 'absolute',
				top: '10px',
				left: '10px',
				fontSize: '16px',
				zIndex: 9000,
			}}>{ink}</p>
			<ScalingCanvas init={init} ref={canvas} />
		</div>
	);
}

export default LimitedInk;
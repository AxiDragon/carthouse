import ScalingCanvas, { type ScalingCanvasRef } from "../components/ScalingCanvas";
import { useRef, useState } from "react";

function LimitedInk() {
	const canvas = useRef<ScalingCanvasRef>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
	const maxInk = 250;
	const [ink, setInk] = useState<number>(maxInk);

	const onMouseMove = (e: MouseEvent) => {
		if (lastPositionRef.current && canvas.current?.isDrawing()) {
			const deltaX = e.clientX - lastPositionRef.current.x;
			const deltaY = e.clientY - lastPositionRef.current.y;

			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

			setInk(prevInk => {
				const newInk = prevInk - distance;
				if (newInk <= 0) {
					contextRef.current!.lineWidth = 0;
					return 0;
				} else {
					contextRef.current!.lineWidth = 8 * (newInk / maxInk);
					contextRef.current!.strokeStyle = `rgba(0, 0, 0, ${newInk / maxInk})`;
				}

				return newInk;
			});
		}

		lastPositionRef.current = { x: e.clientX, y: e.clientY };
	}

	const init = (canvas: HTMLCanvasElement) => {
		canvas.addEventListener('mousemove', onMouseMove);

		contextRef.current = canvas.getContext('2d');
		if (!contextRef.current) return;

		contextRef.current.lineWidth = 8;
		contextRef.current.strokeStyle = 'black';
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
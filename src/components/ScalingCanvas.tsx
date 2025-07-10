import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

type ScalingCanvasProps = {
	init?: (canvasContext: HTMLCanvasElement) => void;
	drawMode?: boolean;
}

type ScalingCanvasRef = {
	getCanvas: () => HTMLCanvasElement;
	isDrawing: () => boolean;
}

const ScalingCanvas = forwardRef<ScalingCanvasRef, ScalingCanvasProps>(({ init, drawMode = true }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const isDrawing = useRef<boolean>(false);

	useImperativeHandle(ref, () => ({
		getCanvas: () => canvasRef.current!,
		isDrawing: () => isDrawing.current,
	}), []);

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;

		init?.(canvas);

		const ctx = canvas.getContext('2d');
		if (!ctx) return; //this should never happen, but makes TS shut up

		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const onMouseMove = (e: MouseEvent) => {
			if (!isDrawing.current) return;

			ctx.lineTo(e.clientX, e.clientY);
			ctx.stroke();
		}

		const onMouseUp = (e: MouseEvent) => {
			isDrawing.current = false;
			ctx.moveTo(e.clientX, e.clientY);
			ctx.beginPath();
		};

		const onMouseDown = () => isDrawing.current = true;

		canvas.addEventListener('mousedown', onMouseDown);
		canvas.addEventListener('mouseup', onMouseUp);

		if (drawMode) {
			canvas.addEventListener('mousemove', onMouseMove);
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'black';
		}

		return () => {
			canvas.removeEventListener('mousedown', onMouseDown);
			canvas.removeEventListener('mouseup', onMouseUp);

			if (drawMode) {
				canvas.removeEventListener('mousemove', onMouseMove);
			}
		};
	}, [drawMode, init]);

	useEffect(() => {
		const handleResize = () => {
			if (!canvasRef.current) return;

			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const oldImage = canvas.toDataURL();
			const oldWidth = canvas.width;
			const oldHeight = canvas.height;

			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			const img = new Image();
			img.src = oldImage;
			img.onload = () => {
				ctx.drawImage(img, 0, 0, oldWidth, oldHeight);
				init?.(canvas);
			};
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
	)
});

export default ScalingCanvas;
export type { ScalingCanvasRef };
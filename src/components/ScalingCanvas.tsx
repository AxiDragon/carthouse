import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

type ScalingCanvasProps = {
	init?: (canvasContext: HTMLCanvasElement) => void;
	drawMode?: boolean;
}

type ScalingCanvasRef = {
	getCanvas: () => HTMLCanvasElement;
	isDrawing: () => boolean;
}

export type Point = {
	x: number,
	y: number,
	width?: number,
	color?: string,
}

const ScalingCanvas = forwardRef<ScalingCanvasRef, ScalingCanvasProps>(({ init, drawMode = true }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const isDrawing = useRef<boolean>(false);
	const strokes = useRef<Point[][]>([]);

	useImperativeHandle(ref, () => ({
		getCanvas: () => canvasRef.current!,
		isDrawing: () => isDrawing.current,
	}), []);

	const startStroke = () => {
		strokes.current.push([]);
	}

	const addPoint = (point: Point) => {
		point.width = point.width || 8;
		point.color = point.color || 'black';

		strokes.current[strokes.current.length - 1].push(point);

		render();
	}

	const addStroke = (stroke: Point[]) => {
		strokes.current.unshift(stroke); //unshift to avoid messing with the currently drawn stroke
	}

	const render = () => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		if (!ctx) return;

		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (const stroke of strokes.current) {
			if (stroke.length === 0) {
				continue;
			}

			ctx.beginPath();
			ctx.moveTo(stroke[0].x, stroke[0].y);

			for (let i = 0; i < stroke.length; i++) {
				ctx.lineTo(stroke[i].x, stroke[i].y);
			}

			ctx.stroke();
		}
	}

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const onMouseMove = (e: MouseEvent) => {
			if (!isDrawing.current) return;

			addPoint({ x: e.clientX, y: e.clientY });
		}

		const onMouseUp = (e: MouseEvent) => {
			isDrawing.current = false;
			addPoint({ x: e.clientX, y: e.clientY });
		};

		const onMouseDown = () => {
			isDrawing.current = true;
			startStroke();
		};

		if (drawMode) {
			canvas.addEventListener('mousedown', onMouseDown);
			canvas.addEventListener('mouseup', onMouseUp);
			canvas.addEventListener('mousemove', onMouseMove);
			ctx.lineWidth = 8;
			ctx.strokeStyle = 'black';
			ctx.lineCap = 'round';
		}

		init?.(canvas);

		return () => {
			if (drawMode) {
				canvas.removeEventListener('mousedown', onMouseDown);
				canvas.removeEventListener('mouseup', onMouseUp);
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
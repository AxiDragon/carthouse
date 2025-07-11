import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

type ScalingCanvasProps = {
	init?: (canvasContext: HTMLCanvasElement) => void;
	drawMode?: boolean;
	getPoint?: (e: MouseEvent) => Point | null;
}

type ScalingCanvasRef = {
	getCanvas: () => HTMLCanvasElement;
	isDrawing: () => boolean;
	addStroke: (points: Point[]) => void;
	addPoint: (point: Point) => void;
	getStrokes: () => Point[][];
}

export type Point = {
	x: number,
	y: number,
	width?: number,
	color?: string,
}

const ScalingCanvas = forwardRef<ScalingCanvasRef, ScalingCanvasProps>(({ init, drawMode = true, getPoint }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D>(null!);
	const isDrawing = useRef<boolean>(false);
	const strokes = useRef<Point[][]>([]);

	useImperativeHandle(ref, () => ({
		getCanvas: () => canvasRef.current!,
		isDrawing: () => isDrawing.current,
		getStrokes: () => strokes.current,
		addStroke,
		addPoint
	}), []);

	const startStroke = () => {
		strokes.current.push([]);
	}

	const addPoint = (point: Point) => {
		point.width = point.width || 8;
		point.color = point.color || 'black';

		strokes.current[strokes.current.length - 1].push(point);

		renderPoint();
	}

	//only render the last point, for performance
	const renderPoint = () => {
		if (!ctxRef.current) return;

		const stroke = strokes.current[strokes.current.length - 1];
		const n = stroke.length;

		if (n < 2) return;

		ctxRef.current.beginPath();
		ctxRef.current.moveTo(stroke[n - 2].x, stroke[n - 2].y);
		ctxRef.current.strokeStyle = stroke[n - 1].color!;
		ctxRef.current.lineWidth = stroke[n - 1].width!;
		ctxRef.current.lineTo(stroke[n - 1].x, stroke[n - 1].y);
		ctxRef.current.stroke();
	}

	const renderStroke = (stroke: Point[]) => {
		for (let i = 1; i < stroke.length; i++) {
			ctxRef.current.beginPath();
			ctxRef.current.moveTo(stroke[i - 1].x, stroke[i - 1].y);
			ctxRef.current.strokeStyle = stroke[i].color!;
			ctxRef.current.lineWidth = stroke[i].width!;
			ctxRef.current.lineTo(stroke[i].x, stroke[i].y);
			ctxRef.current.stroke();
		}
	}

	const addStroke = (stroke: Point[]) => {
		strokes.current.unshift(stroke); //unshift to avoid messing with the currently drawn stroke

		renderStroke(stroke);
	}

	const render = () => {
		if (!canvasRef.current || !ctxRef.current) return;

		const canvas = canvasRef.current;
		ctxRef.current.fillStyle = 'white';
		ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);

		for (const stroke of strokes.current) {
			renderStroke(stroke);
		}
	}

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		ctxRef.current = canvas.getContext('2d')!;
		if (!ctxRef.current) return;

		ctxRef.current.fillStyle = 'white';
		ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);

		const onMouseMove = (e: MouseEvent) => {
			if (!isDrawing.current) return;

			if (getPoint) {
				const point = getPoint(e);
				if (point) {
					addPoint(point);
				}
			} else {
				addPoint({ x: e.clientX, y: e.clientY });
			}
		}

		const onMouseUp = (e: MouseEvent) => {
			isDrawing.current = false;

			if (drawMode) {
				if (getPoint) {
					const point = getPoint(e);
					if (point) {
						addPoint(point);
					}
				} else {
					addPoint({ x: e.clientX, y: e.clientY });
				}
			}
		};

		const onMouseDown = () => {
			isDrawing.current = true;

			if (drawMode) {
				startStroke();
			}
		};

		if (drawMode) {
			canvas.addEventListener('mousedown', onMouseDown);
			canvas.addEventListener('mouseup', onMouseUp);
			canvas.addEventListener('mousemove', onMouseMove);
			ctxRef.current.lineWidth = 8;
			ctxRef.current.strokeStyle = 'black';
			ctxRef.current.lineCap = 'round';
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
			render();
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
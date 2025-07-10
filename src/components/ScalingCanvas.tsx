import { Canvas } from "fabric";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

type ScalingCanvasProps = {
	init?: (canvas: Canvas) => void;
}

type ScalingCanvasRef = {
	getCanvas: () => Canvas;
	isDrawing: () => boolean;
}

const ScalingCanvas = forwardRef<ScalingCanvasRef, ScalingCanvasProps>(({ init }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const fabricCanvasRef = useRef<Canvas | null>(null);
	const isDrawing = useRef<boolean>(false);

	useImperativeHandle(ref, () => ({
		getCanvas: () => fabricCanvasRef.current as Canvas,
		isDrawing: () => isDrawing.current,
	}), []);

	useEffect(() => {
		if (!canvasRef.current) return;

		fabricCanvasRef.current = new Canvas(canvasRef.current, {
			backgroundColor: 'white',
			width: window.innerWidth,
			height: window.innerHeight,
		});

		fabricCanvasRef.current.isDrawingMode = true;
		fabricCanvasRef.current.selection = false;

		if (init) {
			init(fabricCanvasRef.current);
		}

		const onMouseUp = () => isDrawing.current = false;


		const onMouseDown = () => isDrawing.current = true;


		fabricCanvasRef.current.on('mouse:up', onMouseUp);
		fabricCanvasRef.current.on('mouse:down', onMouseDown);

		fabricCanvasRef.current.renderAll();

		return () => {
			fabricCanvasRef.current?.off('mouse:up', onMouseUp);
			fabricCanvasRef.current?.off('mouse:down', onMouseDown);
			fabricCanvasRef.current?.dispose();
			fabricCanvasRef.current = null;
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			if (fabricCanvasRef.current) {
				fabricCanvasRef.current.setDimensions({
					width: window.innerWidth,
					height: window.innerHeight,
				});
				fabricCanvasRef.current.renderAll();
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<canvas ref={canvasRef} />
	)
});

export default ScalingCanvas;
export type { ScalingCanvasRef };
import { Canvas } from "fabric";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

type ScalingCanvasProps = {
	init?: (canvas: Canvas) => void;
}

type ScalingCanvasRef = {
	getCanvas: () => Canvas;
}

const ScalingCanvas = forwardRef<ScalingCanvasRef, ScalingCanvasProps>(({ init }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const fabricCanvasRef = useRef<Canvas | null>(null);

	useImperativeHandle(ref, () => ({
		getCanvas: () => fabricCanvasRef.current as Canvas
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

		fabricCanvasRef.current.renderAll();

		return () => {
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
import { PencilBrush, } from "fabric";
import { useEffect, useRef } from "react";
import ScalingCanvas, { type ScalingCanvasRef } from "../components/ScalingCanvas";

function JustDrawing() {
	const canvasRef = useRef<ScalingCanvasRef>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current.getCanvas();

		canvas.freeDrawingBrush = new PencilBrush(canvas);
		canvas.freeDrawingBrush.width = 8;
		canvas.freeDrawingBrush.color = 'black';
	}, [canvasRef.current]);

	return (
		<ScalingCanvas ref={canvasRef} />
	)
}

export default JustDrawing;

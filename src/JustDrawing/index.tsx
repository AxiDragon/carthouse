import { Canvas, PencilBrush, } from "fabric";
import ScalingCanvas from "../components/ScalingCanvas";

function JustDrawing() {
	const init = (canvas: Canvas) => {
		canvas.freeDrawingBrush = new PencilBrush(canvas);
		canvas.freeDrawingBrush.width = 8;
		canvas.freeDrawingBrush.color = 'black';
	}

	return (
		<ScalingCanvas init={init} />
	)
}

export default JustDrawing;

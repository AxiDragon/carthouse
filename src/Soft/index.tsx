import { useRef } from "react";
import ScalingCanvas, { type ScalingCanvasRef } from "../components/ScalingCanvas";

function Soft() {
	const scalingCanvas = useRef<ScalingCanvasRef>(null);

	const onMouseDown = () => {
		const canvas = scalingCanvas.current!.getCanvas();
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.shadowBlur = 25;
		ctx.shadowColor = 'black';
	}

	const init = (canvas: HTMLCanvasElement) => {
		canvas.addEventListener('mousedown', onMouseDown);

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
	}

	return (
		<ScalingCanvas init={init} ref={scalingCanvas} />
	)
}

export default Soft;

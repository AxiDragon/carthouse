import { useRef } from "react";
import ScalingCanvas, { type ScalingCanvasRef, type Point } from "../components/ScalingCanvas";

function Grid() {
	const scalingCanvas = useRef<ScalingCanvasRef>(null);
	const cellSize = 50;
	const previousPoint = useRef<Point | null>(null);

	const getPoint = (e: MouseEvent) => {
		const x = Math.floor((e.clientX + cellSize / 2) / cellSize) * cellSize;
		const y = Math.floor((e.clientY + cellSize / 2) / cellSize) * cellSize;

		if (previousPoint.current && previousPoint.current.x === x && previousPoint.current.y === y) {
			return null;
		}

		const strokes = scalingCanvas.current?.getStrokes() || [];
		if (strokes.length > 0) {
			const lastStroke = [...strokes[strokes.length - 1], { x, y }];
			const enclosedStroke = checkEnclosed(lastStroke);
			if (enclosedStroke.length > 0) {
				fillStroke(enclosedStroke);
			}
		}

		previousPoint.current = { x, y };
		return { x, y };
	}

	function fillStroke(stroke: Point[]) {
		const canvas = scalingCanvas.current!.getCanvas();

		const ctx = canvas.getContext('2d')!;

		ctx.beginPath();
		ctx.moveTo(stroke[0].x, stroke[0].y);

		for (let i = 0; i < stroke.length; i++) {
			ctx.lineTo(stroke[i].x, stroke[i].y);
		}

		ctx.closePath();

		ctx.fillStyle = getRandomColor();
		ctx.fill();

		ctx.strokeStyle = 'black';
		ctx.lineWidth = 8;
		ctx.stroke();
	}

	//TODO: I guess you only need to check the new point - realistically, all previous points should be checked already
	//TODO: be able to return multiple new enclosements
	function checkEnclosed(stroke: Point[]): Point[] {
		for (let i = 0; i < stroke.length; i++) {
			for (let j = i + 1; j < stroke.length; j++) {
				if (stroke[i].x === stroke[j].x && stroke[i].y === stroke[j].y) {
					return stroke.slice(i, j + 1);
				}
			}
		}

		return [];
	}

	function getRandomColor() {
		const colors = [
			'blue',
			'black',
			'red',
			'yellow',
			'orange',
			'green',
			'purple',
		]

		return colors[Math.floor(Math.random() * colors.length)];
	}

	const init = (canvas: HTMLCanvasElement) => {
		canvas.getContext('2d')!.lineCap = 'square';
	}

	return (
		<ScalingCanvas getPoint={getPoint} ref={scalingCanvas} init={init} wip />
	)
}

export default Grid;
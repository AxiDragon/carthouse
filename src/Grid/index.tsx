import { useRef } from "react";
import ScalingCanvas, { type Point } from "../components/ScalingCanvas";

function Grid() {
	const cellSize = 50;
	const previousPoint = useRef<Point | null>(null);

	const getPoint = (e: MouseEvent) => {
		const x = Math.floor((e.clientX + cellSize / 2) / cellSize) * cellSize;
		const y = Math.floor((e.clientY + cellSize / 2) / cellSize) * cellSize;

		if (previousPoint.current && previousPoint.current.x === x && previousPoint.current.y === y) {
			console.log('same point, skipping');
			return null;
		}

		previousPoint.current = { x, y };
		return { x, y };
	};

	return (
		<ScalingCanvas getPoint={getPoint} />
	)
}

export default Grid;

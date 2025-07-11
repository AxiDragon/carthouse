import ScalingCanvas from "../components/ScalingCanvas";

function Grid() {
	const cellSize = 50;

	const getPoint = (e: MouseEvent) => {
		const x = Math.floor(e.clientX / cellSize) * cellSize;
		const y = Math.floor(e.clientY / cellSize) * cellSize;

		return { x, y };
	};

	return (
		<ScalingCanvas getPoint={getPoint} />
	)
}

export default Grid;

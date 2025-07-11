import ScalingCanvas from "../components/ScalingCanvas";

function CrissCross() {
	const range = 25;

	const getRandom = () => {
		return Math.floor((Math.random() * 2 - 1) * range);
	}

	const getPoint = (e: MouseEvent) => {
		const x = e.clientX + getRandom();
		const y = e.clientY + getRandom();

		return { x, y };
	};

	return (
		<ScalingCanvas getPoint={getPoint} />
	)
}

export default CrissCross;

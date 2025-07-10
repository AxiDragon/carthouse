import ScalingCanvas, { type Point } from "../components/ScalingCanvas";
import { useRef } from "react";

function LimitedInk() {
	const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
	const maxInk = 25000;
	const ink = useRef<number>(maxInk);

	const getPoint = (e: MouseEvent): Point => {
		let width = 8;
		let color = 'black';

		if (lastPositionRef.current) {
			const deltaX = Math.abs(e.clientX - lastPositionRef.current.x);
			const deltaY = Math.abs(e.clientY - lastPositionRef.current.y);

			const distance = deltaX + deltaY; //not entirely accurate, but it works

			ink.current -= distance;
			const ratio = ink.current / maxInk;
			width = Math.max(0, 8 * ratio);
			const l = `${(1 - ink.current / maxInk) * 255}`;
			color = ratio > 0 ? `rgb(${l}, ${l}, ${l})` : 'transparent';
		}

		lastPositionRef.current = { x: e.clientX, y: e.clientY };

		return { x: e.clientX, y: e.clientY, width, color };
	}

	return (
		<ScalingCanvas getPoint={getPoint} />
	);
}

export default LimitedInk;
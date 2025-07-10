import { useEffect, useRef, useState } from "react";
import ScalingCanvas, { type ScalingCanvasRef, type Point } from "../components/ScalingCanvas";

type Props = {
	paths: string[];
}

const xPadding = 100;
const yPadding = 100;
const speed = 0.2 + Math.random() * 2.3;
const circleSpinSpeed = 2 + Math.random() * 28;
const circleDiameter = 50 + Math.random() * 450;
const chance = 1 + Math.random() * 4;

const Home = ({ paths }: Props) => {
	const scalingCanvasRef = useRef<ScalingCanvasRef>(null);
	const [randomPositions, setRandomPositions] = useState<Point[]>(generateRandomPositions());
	const animationFrameRef = useRef<number | null>(null);
	const currentPosition = useRef<{ x: number, y: number }>(randomPositions[0]);
	const mousePosition = useRef<{ x: number, y: number } | null>(null)
	const followerColor = useRef<string>(getRandomColor());

	useEffect(() => {
		if (!scalingCanvasRef.current) return;

		const tick = (now: number) => {
			if (mousePosition.current) {
				const target = {
					x: mousePosition.current.x + Math.sin(now / 1000 * circleSpinSpeed) * circleDiameter,
					y: mousePosition.current.y + Math.cos(now / 1000 * circleSpinSpeed) * circleDiameter,
				}

				const delta = {
					x: currentPosition.current.x - target.x,
					y: currentPosition.current.y - target.y,
				}

				currentPosition.current = {
					x: currentPosition.current.x - (delta.x / 100 * speed),
					y: currentPosition.current.y - (delta.y / 100 * speed),
				}

				if (Math.random() < chance / 1000) {
					followerColor.current = getRandomColor();
				}

				scalingCanvasRef.current!.addPoint({
					...currentPosition.current,
					color: followerColor.current,
					width: 3 + 2 * Math.random()
				})
			}

			animationFrameRef.current = requestAnimationFrame(tick);
		}

		const onMouseMove = (e: MouseEvent) => {
			mousePosition.current = { x: e.clientX, y: e.clientY };
		}

		animationFrameRef.current = requestAnimationFrame(tick);
		window.addEventListener('mousemove', onMouseMove);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			window.removeEventListener('mousemove', onMouseMove);
		}
	}, []);

	function generateRandomPositions(): Point[] {
		const w = window.innerWidth - xPadding * 2;
		const h = window.innerHeight - yPadding * 2;

		const res: Point[] = [];

		const checkProximity = (newPos: { x: number, y: number }): boolean => {
			for (const pos of res) {
				if (
					newPos.x > pos.x - xPadding &&
					newPos.x < pos.x + xPadding &&
					newPos.y > pos.y - yPadding &&
					newPos.y < pos.y + yPadding
				) {
					return false;
				}
			}

			return true;
		}

		for (let index = 0; index < paths.length + 2; index++) {
			let tries = 10;
			let pos = { x: xPadding + w * Math.random(), y: yPadding + h * Math.random() };

			while (!checkProximity(pos) && tries-- > 0) {
				pos = { x: xPadding + w * Math.random(), y: yPadding + h * Math.random() };
			}

			res.push({ ...pos, color: '#bbb', width: 1 })
		}

		return res;
	}

	useEffect(() => {
		setRandomPositions(generateRandomPositions());
	}, [paths]);

	function getRandomColor() {
		const colors = [
			'blue',
			'black',
			'red',
		]

		return colors[Math.floor(Math.random() * colors.length)];
	}

	const morphToHashpath = (path: string): string => {
		return path.replace('/', '/#');
	}

	const init = (_: HTMLCanvasElement) => {
		scalingCanvasRef.current?.addStroke(randomPositions);
	}

	return (<div>
		<ScalingCanvas init={init} ref={scalingCanvasRef} drawMode={false} />
		<h1 className="home-element" style={{
			top: randomPositions[0].y,
			left: randomPositions[0].x,
			fontSize: '4rem'
		}}>cArthouse*</h1>
		<div className="home-element credits" style={{
			top: randomPositions[1].y,
			left: randomPositions[1].x,
		}}>
			<h2>inspiration</h2>
			<ul>
				<li>
					<a href="http://perfectionkills.com/exploring-canvas-drawing-techniques/" target="_blank">kangax</a>
				</li>
				<li>
					<a href="https://www.wickedartsassignments.com/" target="_blank">wicked arts assignments</a>
				</li>
			</ul>
		</div>
		{paths.map((path, i) => (
			<a href={morphToHashpath(path)} key={i} className="home-element" style={{
				top: randomPositions[i + 2].y,
				left: randomPositions[i + 2].x,
			}}>{path}</a>
		))}
	</div>)
}

export default Home;
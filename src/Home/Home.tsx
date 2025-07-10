import { useEffect, useState } from "react";

type Props = {
	paths: string[];
}

const xPadding = 100;
const yPadding = 100;

const Home = ({ paths }: Props) => {
	const [randomPositions, setRandomPositions] = useState<{ x: number, y: number }[]>(generateRandomPositions());

	function generateRandomPositions(): { x: number, y: number }[] {
		const w = window.innerWidth - xPadding * 2;
		const h = window.innerHeight - yPadding * 2;

		const res: { x: number, y: number }[] = [];

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

			res.push(pos)
		}

		return res;
	}

	useEffect(() => {
		setRandomPositions(generateRandomPositions());
	}, [paths]);

	const morphToHashpath = (path: string): string => {
		return path.replace('/', '/#');
	}

	return (<div>
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
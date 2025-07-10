import { useEffect, useState } from "react";

type Props = {
	paths: string[];
}

const xPadding = 100;
const yPadding = 25;

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

		for (let index = 0; index < paths.length; index++) {
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
		<h1 className="home-path" style={{
			top: randomPositions[0].y,
			left: randomPositions[0].x,
		}}>cArthouse*</h1>
		{paths.map((path, i) => (
			<a href={morphToHashpath(path)} key={i} className="home-path" style={{
				top: randomPositions[i].y,
				left: randomPositions[i].x,
			}}>{path}</a>
		))}
	</div>)
}

export default Home;
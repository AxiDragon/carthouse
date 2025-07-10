import { HashRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import Home from "./Home/Home";

const modules = import.meta.glob("./*/index.tsx", { eager: true });

const routes = Object.entries(modules).map(([path, module]) => {
  const routeName = path.split('/')[1].toLowerCase();
  const Component = lazy(() =>
    Promise.resolve(module).then((mod: any) => ({
      default: mod.default,
    }))
  );

  return {
    path: `/${routeName}`,
    component: Component,
  };
});

function App() {
  return (
    <HashRouter>
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="/" element={<Home paths={routes.flatMap(route => route.path)} />} />
      </Routes>
    </HashRouter>
  )
}

export default App;

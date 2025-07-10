import { HashRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";

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

routes.unshift({ path: '/', component: routes[0]?.component });

function App() {
  return (
    <HashRouter>
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </HashRouter>
  )
}

export default App;

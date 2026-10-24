import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { HeroPage } from "./pages/hero/HeroPage";
import { APP_PAGES, HOME_PATH } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HeroPage />} />
          {APP_PAGES.map(({ path, component: Page }) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
          <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

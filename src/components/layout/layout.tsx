import { Aside } from "../aside/aside";
import { Header } from "../header/header";
import { Main } from "../main/main";
import "./layout.css";

export function Layout() {
    return (
        <div className="Layout">
            <header>
                <Header />
            </header>

            <main>
                <Main />
            </main>

            <aside>
                <Aside />
            </aside>
        </div>
    )
}
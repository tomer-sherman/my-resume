import "./header.css";
import me from '../../assets/pictures/pic.jpeg';

export function Header() {
    return (
        <header className="Header">
          
            <div className="Header-overlay"></div>

            {/* Layer 2: The Identity Cluster (Left Side) */}
            <div className="Header-content-cluster">
                <img
                    src={me}
                    alt="Tomer Sherman"
                    className="Header-avatar"
                />

                <div className="Header-name-cluster">
                    <h1>TOMER SHERMAN</h1>
                    <h2>SOFTWARE FULLSTACK PROGRAMER</h2>
                    <p>
                        Programmer with a strong passion for coding.<br />
                        Architecting high-performance React frontend and software solutions.
                    </p>

                    <div className="Header-socials-cluster">
                        <a href="https://github.com/tomer-sherman" target="blank" className="Header-social-link">GitHub</a>
                    </div>
                </div>
            </div>
        </header>
    );
}
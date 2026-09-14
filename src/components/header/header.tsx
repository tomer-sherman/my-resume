import './header.css';
import { resume } from '../../data/resume.data';

const BASE_URL = import.meta.env.BASE_URL;
const { basics, socials, contact } = resume;

export function Header() {
    return (
        <div className="Header">
            <div className="Header-overlay" aria-hidden="true"></div>

            <div className="Header-content-cluster">
                <img
                    src={`${BASE_URL}${basics.image}`}
                    alt={basics.name}
                    className="Header-avatar"
                    width={180}
                    height={180}
                />

                <div className="Header-name-cluster">
                    <h1>{basics.name}</h1>
                    <p className="Header-role">{basics.title}</p>
                    <p className="Header-tagline">{basics.tagline}</p>
                    <p className="Header-intro">{basics.intro}</p>

                    <address className="Header-contact" aria-label={contact.title}>
                        <ul>
                            {contact.lines.map((line) => (
                                <li key={line.text}>
                                    <span className="Header-contact-icon" aria-hidden="true">{line.icon}</span>
                                    {line.text}
                                </li>
                            ))}
                        </ul>
                    </address>

                    <nav className="Header-socials-cluster" aria-label="Profiles">
                        <ul className="Header-links">
                            {socials.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="Header-social-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}

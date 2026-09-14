import './aside.css';
import { resume } from '../../data/resume.data';

const { skills, principles } = resume;

export function Aside() {
    return (
        <div className="Aside">
            <div className="Aside-stack">
                {skills.map((group) => (
                    <section key={group.id} className="Aside-section" aria-labelledby={`${group.id}-title`}>
                        <h2 id={`${group.id}-title`} className="Section-title">{group.title}</h2>
                        <ul className="Chips">
                            {group.items.map((item) => (
                                <li key={item} className="Chip">{item}</li>
                            ))}
                        </ul>
                        {group.note && <p className="Aside-note">{group.note}</p>}
                    </section>
                ))}
            </div>

            <section className="Aside-section" aria-labelledby={`${principles.id}-title`}>
                <h2 id={`${principles.id}-title`} className="Section-title">{principles.title}</h2>
                <ul className="Aside-list">
                    {principles.items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

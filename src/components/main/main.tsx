import './main.css';
import { resume } from '../../data/resume.data';
import { formatMonth, formatStack, PERIOD_SEPARATOR, PRESENT } from '../../utils/format';
import type { Project, TimelineSection } from '../../models/resume.model';

const BASE_URL = import.meta.env.BASE_URL;
const { experience, projects, life } = resume;

function Timeline({ section }: { section: TimelineSection }) {
    return (
        <section className="Main-section" aria-labelledby={`${section.id}-title`}>
            <h2 id={`${section.id}-title`} className="Section-title">{section.title}</h2>

            <ol className="Timeline">
                {section.entries.map((entry) => (
                    <li key={entry.id} className="Timeline-entry">
                        <p className="Timeline-period">
                            <time dateTime={entry.period.start}>{formatMonth(entry.period.start)}</time>
                            {PERIOD_SEPARATOR}
                            {entry.period.end
                                ? <time dateTime={entry.period.end}>{formatMonth(entry.period.end)}</time>
                                : PRESENT}
                        </p>

                        <h3 className="Timeline-title">{entry.title}</h3>

                        {entry.org && (
                            entry.url
                                ? (
                                    <a className="Timeline-org" href={entry.url} target="_blank" rel="noopener noreferrer">
                                        {entry.org}
                                    </a>
                                )
                                : <p className="Timeline-org">{entry.org}</p>
                        )}

                        {entry.summary && <p className="Timeline-summary">{entry.summary}</p>}

                        {entry.bullets && (
                            <ul className="Timeline-bullets">
                                {entry.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                        )}

                        {entry.roles?.map((role) => (
                            <div key={role.title} className="Timeline-role">
                                <h4 className="Timeline-role-title">{role.title}</h4>
                                <p>{role.description}</p>
                            </div>
                        ))}
                    </li>
                ))}
            </ol>
        </section>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <article className="Project">
            <h3 className="Project-title">
                {project.name}
                {project.kind && (
                    <span className="Project-kind">
                        {project.icon && (
                            <img
                                className="Project-kind-icon"
                                src={`${BASE_URL}${project.icon}`}
                                alt=""
                                width={14}
                                height={14}
                            />
                        )}
                        {project.kind}
                    </span>
                )}
            </h3>

            <p className="Project-stack">{formatStack(project.stack)}</p>

            <ul className="Project-bullets">
                {project.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                ))}
            </ul>

            <p className="Project-links">
                {project.links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="Project-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label}: ${project.name}`}
                    >
                        {link.label}
                    </a>
                ))}
            </p>
        </article>
    );
}

export function Main() {
    return (
        <div className="Main">
            <Timeline section={experience} />

            <section className="Main-section" aria-labelledby={`${projects.id}-title`}>
                <h2 id={`${projects.id}-title`} className="Section-title">{projects.title}</h2>
                <ul className="Projects">
                    {projects.items.map((project) => (
                        <li key={project.id}>
                            <ProjectCard project={project} />
                        </li>
                    ))}
                </ul>
            </section>

            <Timeline section={life} />
        </div>
    );
}

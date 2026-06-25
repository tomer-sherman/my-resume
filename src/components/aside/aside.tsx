import "./aside.css";

export function Aside() {
    return (
        <div className="Aside">
            <h1>FRONTEND TOOLSET</h1>
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript </li>
                <li>TypeScript</li>
                <li>React Framework</li>
            </ul>

            <h2>GENERAL TRAITS</h2>
            <ul>
                <li>Object-Oriented Programming</li>
                <li>System Architecture</li>
                <li>UI/UX Precision</li>
                <li>Problem Solving</li>
                
            </ul>

            <h2>CONTACT DATA</h2>
            <div style={{ marginTop: '10px' }}>
                <p>📍 Israel - Rehovot</p>
                <p>📞 +972 52-691-0602</p>
                <p>✉️ tomer.sherman11@gmail.com</p>
            </div>
        </div>
    )
}
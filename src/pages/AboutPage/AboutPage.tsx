import styles from './AboutPage.module.scss';

const AboutPage = () => {
    return (
        <div className={styles.aboutPage}>
            <h1>🧩 О проекте</h1>
            <p>
                <strong>CityAppeals</strong> — это веб-приложение для анализа обращений граждан города Алматы.
                Цель проекта — предоставить визуальный и аналитический обзор городских проблем на основе геоданных и статистики.
            </p>

            <h2>📌 Возможности платформы:</h2>
            <ul>
                <li>📊 <strong>Аналитика</strong>: отслеживание количества обращений по типам и районам.</li>
                <li>🗺 <strong>Геоаналитика</strong>: интерактивные карты с распределением обращений.</li>
                <li>🏙 <strong>Районы</strong>: визуализация обращений по административным районам.</li>
                <li>📝 <strong>История обращений</strong>: просмотр всех обращений с фильтрами и экспортом.</li>
                <li>⚙️ <strong>Технологии</strong>: Django (backend), PostgreSQL, React + TypeScript + Vite (frontend), Mapbox GL JS.</li>
            </ul>

            <h2>💡 Особенности:</h2>
            <ul>
                <li>Интерактивная карта с фильтрацией по годам и месяцам</li>
                <li>Поддержка полноэкранного режима</li>
                <li>Геопривязка обращений и районов</li>
                <li>Удобный экспорт данных в CSV</li>
            </ul>

        </div>
    );
};

export default AboutPage;

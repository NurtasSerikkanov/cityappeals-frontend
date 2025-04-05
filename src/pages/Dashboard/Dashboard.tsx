import { useEffect, useState } from 'react';
import {
    getAppealStats,
    getAppealSummary,
    getAppealsByType,
} from '../../apiCode/api';
import styles from './Dashboard.module.scss';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip,
} from 'recharts';
import totalIcon from '../../assets/total.svg';
import resolvedIcon from '../../assets/resolved.svg';
import progressIcon from '../../assets/in_progress.svg';

const COLORS = ['#4F46E5', '#16A34A', '#DC2626', '#F59E0B', '#8B5CF6'];
const monthLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

export default function Dashboard() {
    const [stats, setStats] = useState({
        summary: {
            total: 0,
            resolved: 0,
            in_progress: 0,
            with_budget: 0,
        },
        monthly_data: {},
    });

    const [summary, setSummary] = useState({
        total: 0,
        resolved: 0,
        in_progress: 0,
    });

    const [appealTypeData, setAppealTypeData] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    useEffect(() => {
        getAppealStats().then((res) => setStats(res.data));
    }, []);

    useEffect(() => {
        getAppealSummary(selectedYear || undefined, selectedMonth ?? undefined)
            .then((res) => setSummary(res.data));

        getAppealsByType(selectedYear || undefined, selectedMonth ?? undefined)
            .then((res) => {
                const data = res.data.map((item: any, index: number) => ({
                    name: item.appeal_type_ru,
                    value: item.count,
                    color: COLORS[index % COLORS.length],
                }));
                setAppealTypeData(data);
            });
    }, [selectedYear, selectedMonth]);

    const monthlyData = selectedYear && stats.monthly_data[selectedYear]
        ? Object.entries(stats.monthly_data[selectedYear]).map(([month, count]) => ({
            name: monthLabels[+month - 1],
            value: count,
        }))
        : [];

    return (
        <div className={styles.dashboard}>
            <h2>📊 Дашборд обращений г. Алматы</h2>
            <p className={styles.subtitle}>Аналитика обращений жителей города: жалобы, заявления, предложения</p>

            {/* Статистика */}
            <div className={styles.statsContainer}>
                <div className={`${styles.statCard} ${styles.blue}`}>
                    <div className={styles.icon}><img src={totalIcon} alt="total" /></div>
                    <p>Обращений всего</p>
                    <h2>{summary.total.toLocaleString()}</h2>
                    <span className={styles.statSub}>
                        за {selectedMonth !== null ? monthLabels[selectedMonth] : 'весь год'}
                    </span>
                </div>
                <div className={`${styles.statCard} ${styles.green}`}>
                    <div className={styles.icon}><img src={resolvedIcon} alt="resolved" /></div>
                    <p>Решено</p>
                    <h2>{summary.resolved.toLocaleString()}</h2>
                    <span className={styles.statSub}>
                        {(summary.total ? (summary.resolved / summary.total) * 100 : 0).toFixed(1)}% от общего числа
                    </span>
                </div>
                <div className={`${styles.statCard} ${styles.red}`}>
                    <div className={styles.icon}><img src={progressIcon} alt="in progress" /></div>
                    <p>В процессе</p>
                    <h2>{summary.in_progress.toLocaleString()}</h2>
                    <span className={styles.statSub}>
                        {(summary.total ? (summary.in_progress / summary.total) * 100 : 0).toFixed(1)}% от общего числа
                    </span>
                </div>
            </div>

            {/* Селектор года */}
            <div className={styles.yearSelector}>
                <button
                    onClick={() => {
                        setSelectedYear('');
                        setSelectedMonth(null);
                    }}
                    className={selectedYear === '' ? styles.yearButtonActive : styles.yearButton}
                >
                    Все
                </button>
                {Object.keys(stats.monthly_data).map((year) => (
                    <button
                        key={year}
                        onClick={() => {
                            setSelectedYear(year);
                            setSelectedMonth(null);
                        }}
                        className={selectedYear === year ? styles.yearButtonActive : styles.yearButton}
                    >
                        {year}
                    </button>
                ))}
            </div>

            {/* Графики */}
            <div className={styles.graphSection}>
                {/* Бар-чарт */}
                <div className={styles.barChart}>
                    <h3>📈 Динамика обращений по месяцам {selectedYear ? `(${selectedYear})` : '(все годы)'}</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            data={monthlyData}
                            onClick={(data: any) => {
                                if (data?.activeLabel) {
                                    const monthIndex = monthLabels.indexOf(data.activeLabel);
                                    setSelectedMonth((prev) => (prev === monthIndex ? null : monthIndex));
                                }
                            }}
                        >
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div className={styles.pieChart}>
                    <h3>📌 TOP категории {selectedMonth !== null ? `за ${monthLabels[selectedMonth]}` : selectedYear ? `в ${selectedYear}` : 'за все время'}</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={appealTypeData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={40}
                                outerRadius={80}
                                label
                            >
                                {appealTypeData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className={styles.legend}>
                        {appealTypeData.map((item, index) => (
                            <div key={index} className={styles.legendItem}>
                                <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
                                <span className={styles.legendLabel}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

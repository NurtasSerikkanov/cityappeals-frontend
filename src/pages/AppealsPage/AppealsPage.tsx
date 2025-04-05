import { useEffect, useState } from 'react';
import { getPaginatedAppeals } from '../../apiCode/api';
import styles from './AppealsPage.module.scss';

const AppealsPage = () => {
    const [appeals, setAppeals] = useState([]);
    const [filters, setFilters] = useState({ year: '', month: '', type: '', district: '', page: 1 });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getPaginatedAppeals(filters).then(res => {
            setAppeals(res.data.results);
            setTotalPages(res.data.total_pages);
        });
    }, [filters]);

    const districts = [
        { label: 'Бостандыкский', value: 'Бостандық ауданы' },
        { label: 'Ауэзовский', value: 'Әуезов ауданы' },
        { label: 'Алмалинский', value: 'Алмалы ауданы' },
        { label: 'Медеуский', value: 'Медеу ауданы' },
        { label: 'Турксибский', value: 'Түрксіб ауданы' },
        { label: 'Алатауский', value: 'Алатау ауданы' },
        { label: 'Жетысуский', value: 'Жетісу ауданы' },
        { label: 'Наурызбайский', value: 'Наурызбай ауданы' }
    ];

    const getVisiblePages = (current: number, total: number): (number | string)[] => {
        const delta = 2;
        const range: (number | string)[] = [];

        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (left > 2) {
            range.unshift('...');
        }
        if (right < total - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (total > 1) {
            range.push(total);
        }

        return Array.from(new Set(range)); // Убираем дубли
    };

    const handleExport = async () => {
        try {
            const res = await getPaginatedAppeals({ ...filters, page: 1, all: true }); // `all` если на бэке есть такой параметр
            const appeals = res.data.results;

            const headers = ['Дата', 'Тип', 'Район', 'Статус', 'Описание'];
            const rows = appeals.map((item: any) => [
                item.creation_date,
                item.appeal_type_ru,
                item.district,
                item.status_display === 'В работе' ? 'В процессе' : item.status_display,
                item.description?.replace(/\n/g, ' ').replace(/,/g, ';'), // безопасно для CSV
            ]);

            let csvContent = 'data:text/csv;charset=utf-8,';
            csvContent += headers.join(',') + '\n';
            rows.forEach(row => {
                csvContent += row.join(',') + '\n';
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `appeals_export.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            alert('Ошибка при экспорте');
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>🧾 Все обращения</h1>

            <div className={styles.filters}>
                <select value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value, page: 1 })}>
                    <option value="">Все годы</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                </select>
                <select value={filters.month} onChange={e => setFilters({ ...filters, month: e.target.value, page: 1 })}>
                    <option value="">Все месяцы</option>
                    <option value="1">Январь</option>
                    <option value="2">Февраль</option>
                    <option value="3">Март</option>
                    <option value="4">Апрель</option>
                    <option value="5">Май</option>
                    <option value="6">Июнь</option>
                    <option value="7">Июль</option>
                    <option value="8">Август</option>
                    <option value="9">Сентябрь</option>
                    <option value="10">Октябрь</option>
                    <option value="11">Ноябрь</option>
                    <option value="12">Декабрь</option>
                </select>
                <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}>
                    <option value="">Все типы</option>
                    <option value="Жалоба">Жалоба</option>
                    <option value="Благодарность">Благодарность</option>
                    <option value="Предложение">Предложение</option>
                    <option value="Сообщение">Сообщение</option>
                    <option value="Заявление">Заявление</option>
                    <option value="Запрос">Запрос</option>
                    <option value="Иное">Иное</option>
                </select>
                <select value={filters.district} onChange={e => setFilters({ ...filters, district: e.target.value, page: 1 })}>
                    <option value="">Все районы</option>
                    {districts.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                </select>
            </div>

            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Дата</th>
                    <th>Тип</th>
                    <th>Район</th>
                    <th>Статус</th>
                    <th>Описание</th>
                </tr>
                </thead>
                <tbody>
                {appeals.map((item: any) => (
                    <tr key={item.id}>
                        <td>{item.creation_date}</td>
                        <td>{item.appeal_type_ru}</td>
                        <td>{item.district_name}</td>
                        <td>
                            {item.status_display === 'В работе' ? 'В процессе' : item.status_display}
                        </td>

                        <td>
                            <div className={styles.description}>{item.description}</div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                {getVisiblePages(filters.page, totalPages).map((p, i) =>
                    typeof p === 'string' ? (
                        <span key={`ellipsis-${i}`}>...</span>
                    ) : (
                        <button
                            key={`page-${p}`}
                            className={filters.page === p ? styles.active : ''}
                            onClick={() => setFilters({ ...filters, page: p })}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>

            <button className={styles.exportButton} onClick={handleExport}>
                📥 Выгрузить в Excel/CSV
            </button>
        </div>
    );
};

export default AppealsPage;

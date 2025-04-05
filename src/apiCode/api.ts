import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const getAppeals = (year?: string, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (typeof month === 'number') params.append('month', (month + 1).toString());
    return API.get('/appeals/', { params });
};

export const getAppealStats = (year?: string) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    return API.get('/appeals-statistics/', { params });
};

export const getAppealSummary = (year?: string, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (typeof month === 'number') params.append('month', (month + 1).toString());
    return API.get('/appeals-summary/', { params });
};

export const getAppealsByType = (year?: string, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (typeof month === 'number') params.append('month', (month + 1).toString());
    return API.get('/appeals-by-type/', { params });
};

export const getFastHexagons = (year?: string, month?: string) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    return API.get(`/fast-hexagons/?${params.toString()}`);
};

export const getHexagons = (year?: string, month?: string) => {
    let url = '/fast-hexagons/'; // используем аггрегацию
    const params = new URLSearchParams();

    if (year && year !== 'all') params.append('year', year);
    if (month && month !== 'all') params.append('month', month);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    return API.get(url);
};

export const getPaginatedAppeals = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);
    if (filters.type) params.append('type', filters.type);
    if (filters.district) params.append('district_name', filters.district);
    if (filters.page) params.append('page', filters.page.toString());

    return API.get(`/appeals-list/?${params.toString()}`);
};

export const getDistrictPolygons = (year?: string, month?: string) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    return API.get(`/districts-polygons/?${params.toString()}`);
};

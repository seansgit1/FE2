export const API_CONFIG = {
    //BASE_URL: 'http://localhost:8000',
    BASE_URL: 'http://192.168.12.24',
    ENDPOINTS: {
        SAMPLES: '/api/samples',
        STATUSES: '/api/statuses',
        MATERIALS: '/api/materials',
        EVENTS: '/api/events',
        SAMPLE_RESULTS: '/api/sample-results',
        SAMPLE_RESULTS_UPDATE: '/api/sample-results/update'
    }
}

export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`
}

export const getFullUrl = (endpoint, id = null) => {
    const baseEndpoint = API_CONFIG.ENDPOINTS[endpoint]
    if (!baseEndpoint) {
        throw new Error(`Unknown endpoint: ${endpoint}`)
    }
    return id ? getApiUrl(`${baseEndpoint}/${id}/`) : getApiUrl(`${baseEndpoint}/`)
}

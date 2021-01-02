const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    nacosServer: 'http://localhost:8848/nacos',
    sentinelDashboard: 'http://localhost:8021',
    mossServer: 'http://localhost:8022',
    swaggerApi: baseUrl + '/doc.html',
    pikaUpmsDruid: 'http://localhost:8120/druid'
  }
}

export default api

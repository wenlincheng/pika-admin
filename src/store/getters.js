const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  routers: state => state.user.routers,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  dictTypes: state => state.dict.dictList,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  nacosServer: state => state.api.nacosServer,
  sentinelDashboard: state => state.api.sentinelDashboard,
  pikaUpmsDruid: state => state.api.pikaUpmsDruid,
  mossServer: state => state.api.mossServer,
  swaggerApi: state => state.api.swaggerApi

}
export default getters

Package.describe({
  summary: "Plugin for address lookup that formats an address, grabs coordinates and allows users to shift an address by moving a dropped pin."
});

Package.on_use(function (api) {
  // Templating makes the templates defined in googe_map_locate.html available outside
  api.use('templating', 'client');

  // Can add files individually or as an array argument
  // Demo - show how to add less
  api.add_files([
    'client/google_map_locator.js',
    'client/google_map_locate.html'
  ], 'client');

  // api.add_files('server/boot.js', 'server');

  // Export any namespaces to be available within broader application scope
  api.export('GoogleMapLocator');
});
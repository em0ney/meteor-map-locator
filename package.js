Package.describe({
  summary: "Plugin for geocoding (address lookup) that allows users to shift an address with a pin.",
  git: "https://github.com/em0ney/meteor-map-locator.git",
  version: "0.0.2"
});

Package.on_use(function (api) {
  // Templating makes the templates defined in googe_map_locate.html available outside
  api.use([
    'templating@1.0.4',
    'check'
  ], 'client');

  // Can add files individually or as an array argument
  // Demo - show how to add less
  api.add_files([
    'client/google_map_locate.html',
    'client/google_map_locator.js'
  ], 'client');

  // api.add_files('server/boot.js', 'server');

  // Export any namespaces to be available within broader application scope
  api.export([
    'GoogleMapLocator',
    'map',
    'geocoder',
    'marker'
  ]);
});
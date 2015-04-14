Package.describe({
  summary: "Google maps geocoding, reverse geocoding and address selection by shifting a pin.",
  git: "https://github.com/em0ney/meteor-map-locator.git",
  version: "0.1.1"
});

Package.on_use(function (api) {
  // Templating makes the templates defined in googe_map_locate.html available outside
  api.use([
    'templating@1.0.4',
    'check@1.0.5',
    'underscore@1.0.3'
  ], 'client');

  // Can add files individually or as an array argument
  // Demo - show how to add less
  api.add_files([
    'client/google_map_locate.css',
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

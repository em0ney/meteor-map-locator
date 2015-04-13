var map, geocoder, marker;
var defaults = {
  api_key: '',
  region: 'au',
  defaultLat: -33.867791,
  defaultLng: 151.20774900000004,
  initialZoom: 12,
  focusedZoom: 17,
  renderedDelay: 0,
  address_components: {}
};
GoogleMapLocator = {
  callbacks: [],

  init: function(api_key, options) {
    if (options === undefined) {
      options = {};
    }
    options.api_key = api_key;
    options = _.defaults(options, defaults);
    _.each(options, function(value, key) {
      GoogleMapLocator[key] = value;
    });
    /* Set up default callbacks */
    GoogleMapLocator.callbacks.push(GoogleMapLocator.initializeVars); // should go first
  },

  initialize: function(callback) {
    if (typeof(window.google) === "undefined") {
      if (_.isFunction(callback) && !_.contains(GoogleMapLocator.callbacks, callback)) {
        GoogleMapLocator.callbacks.push(callback);
      }
      $('<script>', {
        type: 'text/javascript',
        src: "https://maps.googleapis.com/maps/api/js?key=" + GoogleMapLocator.api_key + "&region=" + GoogleMapLocator.region + "&sensor=true&callback=GoogleMapLocator.mapsCallback"
      }).appendTo('body');
    } else {
      callback();  
    }
  },

  mapsCallback: function() {
    _.each(GoogleMapLocator.callbacks, function(fn) {
      fn();
    });
  },

  initializeVars: function() {
    geocoder = new google.maps.Geocoder();
  },

  initializeMap: function() {
    var mapOptions = {
      zoom: GoogleMapLocator.initialZoom,
      center: new google.maps.LatLng(GoogleMapLocator.defaultLat, GoogleMapLocator.defaultLng)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    if (! GoogleMapLocator.lng) {
      marker = null;
    } else {
      position = {
        lat: GoogleMapLocator.lat,
        lng: GoogleMapLocator.lng
      };
      map.setCenter(position);
      map.setZoom(GoogleMapLocator.focusedZoom);
      marker = new google.maps.Marker({
        map: map, 
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: position
      });
      GoogleMapLocator.setMarkerDraggable();
    }
  },

  setLocation: function(location) {
    check(location, {lat: Number, lng: Number});
    GoogleMapLocator.lat = location.lat;
    GoogleMapLocator.lng = location.lng;
  },

  codeAddress: function(fromBlur) {
    var address = $("input[name=address]").val();
    geocoder.geocode( { 'address': address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        position = results[0].geometry.location;
        map.setCenter(position);
        map.setZoom(GoogleMapLocator.focusedZoom);
        if (fromBlur && marker !== null) {
          marker.setPosition(position); 
        } else {
          marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: position
          });
          GoogleMapLocator.setMarkerDraggable();
        }
        GoogleMapLocator.recordAddressComponents(results);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  },

  reverseGeocode: function(location, success_callback) {
    check(location, {lat: Number, lng: Number});
    if (typeof(geocoder) === "undefined") {
      geocoder = new google.maps.Geocoder();
    }
    var latlng = new google.maps.LatLng(location.lat, location.lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results.length > 0) {
          if (_.isUndefined(success_callback)) {
            console.log("no success callback defined, dumping results");
            console.log(results);
          } else {
            success_callback(results);
          }
        } else {
          console.log('No reverse geocode results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  },

  recordAddressComponents: function(results) {
    position = results[0].geometry.location;
    GoogleMapLocator.lat = position.lat();
    GoogleMapLocator.lng = position.lng();
    $("input[name=address]").val(results[0].formatted_address);
    GoogleMapLocator.parseAddressComponents(results[0].address_components);
  },

  parseAddressComponents: function(address_components) {
    var components = {};
    $(address_components).each(function(idx, e) { 
      var value_short = e.short_name;
      var value_long = e.long_name;
      var key = e.types[0];
      components[key] = {
        "value_short": value_short,
        "value_long": value_long
      };
    });
    GoogleMapLocator.address_components = components;
  },

  codePosition: function(position) {
    geocoder.geocode({
      latLng: position
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(position);
        GoogleMapLocator.recordAddressComponents(results);
      } else {
        alert('Cannot determine address at this location.' + status);
      }
    });
  },

  setMarkerDraggable: function() {
    google.maps.event.addListener(marker, 'dragend', function() {
      GoogleMapLocator.codePosition(marker.getPosition());
    });
  }
};


Template.map_locate_fields.events({
  'click button.geolocate' : function(e, tpl) {
    e.preventDefault();
    return GoogleMapLocator.codeAddress(false);
  },
  'blur input[name=address]' : function(e) {
    // Ignore blur where user picks up the marker off the map (otherwise we duplicate marker)
    if ($("input[name=address]").val()) {
      return GoogleMapLocator.codeAddress(true);
    }
  }
});

Template.map_canvas.rendered = function() {
  if (GoogleMapLocator.renderedDelay > 0) {
    window.setTimeout(function() {
      GoogleMapLocator.initialize(GoogleMapLocator.initializeMap);
    }, GoogleMapLocator.renderedDelay);
  } else {
    GoogleMapLocator.initialize(GoogleMapLocator.initializeMap);
  }
};

Template.map_canvas.destroyed = function () {
  GoogleMapLocator.renderedDelay = 0;
  GoogleMapLocator.lat = null;
  GoogleMapLocator.lng = null;
};

var map, geocoder, marker;
GoogleMapLocator = {
  init: function(api_key, options) {
    if (options === undefined) {
      options = {};
    }
    GoogleMapLocator.api_key = api_key || '';
    GoogleMapLocator.lat = options.lat || -33.867791;
    GoogleMapLocator.lng = options.lng || 151.20774900000004;
    GoogleMapLocator.initialZoom = options.initialZoom || 12;
    GoogleMapLocator.focusedZoom = options.initialZoom || 17;
  },
  initializeMap: function() {
    var mapOptions = {
      zoom: GoogleMapLocator.initialZoom,
      center: new google.maps.LatLng(GoogleMapLocator.lat, GoogleMapLocator.lng);
    };
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    if (! $("input[name=lat]").val()) {
      marker = null;
    } else {
      position = {
        lat: parseFloat($("input[name=lat]").val()),
        lng: parseFloat($("input[name=lng]").val())
      }
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
            draggable:true,
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

  recordAddressComponents: function(results) {
    position = results[0].geometry.location;
    $("input[name=lat]").val(position.lat());
    $("input[name=lng]").val(position.lng());
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
    $("input[name=address_components]").val(JSON.stringify(components));
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
  },

  getAddressComponents: function(form) {
    return JSON.parse($(form.find('[name=address_components]')).val());
  }

};

if (Meteor.isClient) {
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
    $('<script>', {
      type: 'text/javascript',
      src: "https://maps.googleapis.com/maps/api/js?key=" + GoogleMapLocator.api_key + "&sensor=true&callback=GoogleMapLocator.initializeMap"
    }).appendTo('body');
    var map, geocoder, marker;
  };
}
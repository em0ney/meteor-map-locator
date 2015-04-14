## Overview 

This is meteor package to provide the following:

- Customizable map canvas
- Geocoding with an address search field and geo-biased results.
- Ability to drag a dropped pin to change the address on both the map and the search field
- Capability to reverse geocode saved co-ordinates

## Installation

`meteor add em0ney:map-locator`

## Usage

#### Initialize google maps

To access google maps, you will need to provide your [google maps API key](https://developers.google.com/maps/documentation/javascript/tutorial#api_key).  We have a range of other configurable options as well.

    GoogleMapLocator.init(api_key, options)
    
    // defaults
    options = {
       region: 'au', /* Region biasing.  Set to your ccTLD */
       /*  the next two set the map centre on a map with no set pin or location */
       defaultLat: -33.867791,
       defaultLng: 151.20774900000004,
       initialZoom: 12, /* Initial zoom on map */
       focusedZoom: 17, /* Zoom on map after a match is made */
       renderedDelay: 0 /* If showing map after a css transition, set a delay on the map initialization through this setting */
    }
    
Example usage:

    if (Meteor.isClient) {
    	Meteor.startup(function() {
    		GoogleMapLocator.init('YOUR-API-KEY');
    		// OR
    		GoogleMapLocator.init('YOUR-API-KEY', {defaultLat:33.12738, defaultLng: 151.20277});    		
    	});
    }

#### Include map canvas and search fields

Within your form, to include the search field and hidden fields for the returned address and location data, reference the map_locate_fields template:

    {{> map_locate_fields }}

To show the map canvas, within the form reference the map-canvas template:

    {{> map_canvas}}

Then when dealing with a form submission, access the set data using these accessors:

    GoogleMapLocator.lat;
    GoogleMapLocator.lng;
    GoogleMapLocator.address_components;
    // Formatted address lives in the 'address' input
    $("input[name=address]").val();

To show a map with an address set, simply set `GoogleMapLocator.lat` and `GoogleMapLocator.lng` before the map canvas is rendered e.g.

    Template.your_template_name.created = function() {
      GoogleMapLocator.lat = <your_lat>;
      GoogleMapLocator.lng = <your_lng>;
      GoogleMapLocator.renderedDelay = <timing_of_any_css_effects>;

      /* Don't worry, these settings are reset each time that the map_canvas template is destroyed, so will not bleed between templates */
    };

### Methods

##### reverseGeocode
reverseGeocode: function(location, success_callback, failure_callback) {}

reverseGeocode takes a location `{lat: Number, lng: Number}`, a success function that receives a single argument, an [array of results](https://developers.google.com/maps/documentation/geocoding/#JSON) and a failure function that receives a single String argument, a [status code](https://developers.google.com/maps/documentation/geocoding/#StatusCodes).


##### codeAddressString
codeAddressString: function (address, callback) {}

codeAddressString takes a string representation of an address and a callback function that takes two arguments, an [array of results](https://developers.google.com/maps/documentation/geocoding/#JSON) and a [status code](https://developers.google.com/maps/documentation/geocoding/#StatusCodes)

    GoogleMapLocator('1 Martin Place, Sydney', function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        // Deal with results
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });


##### extractAddressComponents
extractAddressComponents: function(address_components) {}

As you can see in the documentation, the address components are returned as an array rather than a hash, making it harder to extract useful information.  This method constructs a hash from the array results.

###### input:

    "address_components" : [
      {
         "long_name" : "1600",
         "short_name" : "1600",
         "types" : [ "street_number" ]
      },
      {
         "long_name" : "Amphitheatre Parkway",
         "short_name" : "Amphitheatre Pkwy",
         "types" : [ "route" ]
      },
      {
         "long_name" : "Mountain View",
         "short_name" : "Mountain View",
         "types" : [ "locality", "political" ]
      },
      {
         "long_name" : "Santa Clara County",
         "short_name" : "Santa Clara County",
         "types" : [ "administrative_area_level_2", "political" ]
      },
      {
         "long_name" : "California",
         "short_name" : "CA",
         "types" : [ "administrative_area_level_1", "political" ]
      },
      {
         "long_name" : "United States",
         "short_name" : "US",
         "types" : [ "country", "political" ]
      },
      {
         "long_name" : "94043",
         "short_name" : "94043",
         "types" : [ "postal_code" ]
      }
    ]

###### output:

    {
      'street_number': {
        'value_short': '1600',
        'value_long': '1600'
      },
      'route': {
        'value_short': 'Amphitheatre Pkwy',
        'value_long': 'Amphitheatre Parkway'
      },
      'locality': {
        'value_short': 'Mountain View',
        'value_long': 'Mountain View'
      },
      'administrative_area_level_2': {
        'value_short': 'Santa Clara County',
        'value_long': 'Santa Clara County'
      },
      'administrative_area_level_1': {
        'value_short': 'CA',
        'value_long': 'California'
      },
      'country': {
        'value_short': 'US',
        'value_long': 'United States'
      },
      'postal_code': {
        'value_short': '94043',
        'value_long': '94043'
      }
    }


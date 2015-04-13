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
    
#### Read different fields

When dealing with a form submission, pass the form element or the whole template into the honeypot ishuman function:

    GoogleMapLocator.getAddressComponents(form);
    

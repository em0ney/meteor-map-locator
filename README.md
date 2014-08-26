## Overview 

This is a meteorite package to provide geocoding through a map canvas and search field.  Using the search field, search for an address and have google format this address for you.  Then either drag a dropped pin to change the address, or amend the search.

A structured JSON document of the diffrent address components and the latitude and langitude are stored in hidden fields as well.

## Installation

Install by typing `mrt add map-locator`

## Usage

#### Initialize google maps

To access google maps, you will at least need to provide your [google maps API key](https://developers.google.com/maps/documentation/javascript/tutorial#api_key).  We have a range of other configurable options as well.

    GoogleMapLocator.init(api_key, options)
    
    // defaults
    options = {
       region: 'au', /* Region biasing.  Set to your ccTLD */
       lat: -33.867791,
       lng: 151.20774900000004,
       initialZoom: 12, /* Initial zoom on map */
       focusedZoom: 17 /* Zoom on map after a match is made */
    }
    
Example usage:

    if (Meteor.isClient) {
    	Meteor.startup(function() {
    		GoogleMapLocator.init('YOUR-API-KEY');
    		// OR
    		GoogleMapLocator.init('YOUR-API-KEY', {lat:33.12738, lng: 151.20277});    		
    	});
    }

#### Include map canvas and search fields

Within your form, to include the search field and hidden fields for the returned address and location data, reference the map_locate_fields template:

    {{> map_locate_fields }}

To show the map canvas, within the form reference the map-canvas template:

    {{> map_canvas}}
    
#### Read different fields

When dealing with a form submission, pass the form element or the whole template into the honeypot ishuman function:

    GoogleMapLocator.getAddressComponents(form);
    

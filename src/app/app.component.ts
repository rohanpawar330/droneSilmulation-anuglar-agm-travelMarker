import { Component } from '@angular/core';
import { EventType, TravelData, TravelMarker, TravelMarkerOptions } from 'travel-marker';
import { locationData } from './location.data';
declare const google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // google maps zoom level
  zoom: number = 13;

  // initial center position for the map
  lat: number = 23.203747269900372;
  lng: number = 80.00000841961271;
  longitude?: number = undefined;
  latitude?: number = undefined;
  map: any;
  line: any;
  directionsService: any;
  marker: any;
  // speedMultiplier to control animation speed
  speedMultiplier = 1;

  onMapReady(map: any) {
    console.log(map);
    this.map = map;
    this.mockDirections();
  }


  /**
   *                  IMPORTANT NOTICE
   *  Google stopped its FREE TIER for Directions service.
   *  Hence the below route calculation will not work unless you provide your own key with directions api enabled
   *
   *  Meanwhile, for the sake of demo, precalculated value will be used
   */

  // mock directions api
  mockDirections() {
    const locationArray = locationData.map(
      (l) => new google.maps.LatLng(l[0], l[1])
    );
    this.line = new google.maps.Polyline({
      strokeOpacity: 0.5,
      path: [],
      map: this.map,
    });

    locationArray.forEach((l) => this.line.getPath().push(l));
    console.log(locationArray);
    console.log(locationData);
    const start = new google.maps.LatLng(locationData[0][0], locationData[0][1]);
    const end = new google.maps.LatLng(locationData[locationData.length - 1][0], locationData[locationData.length - 1][1]);

    new google.maps.Marker({
      position: start,
      map: this.map,
      label: 'Start',
    });
    new google.maps.Marker({
      position: end,
      map: this.map,
      label: 'End',
    });
    this.initRoute();
  }

  // initialize travel marker
  initRoute() {
    const route = this.line.getPath().getArray();

    // options
    const options: TravelMarkerOptions = {
      map: this.map, // map object
      speed: 1000, // default 10 , animation speed
      interval: 10, // default 10, marker refresh time
      speedMultiplier: this.speedMultiplier,
      markerOptions: {
        title: 'Travel Marker',
        animation: google.maps.Animation.DROP,
        icon: {
          url: './assets/icons/drone.svg',
          // This marker is 20 pixels wide by 32 pixels high.
          animation: google.maps.Animation.DROP,
          // size: new google.maps.Size(256, 256),
          scaledSize: new google.maps.Size(50, 50),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(22, 30),
        },
      },
    };

    // define marker
    this.marker = new TravelMarker(options);

    // add locations from direction service
    this.marker.addLocation(route);

    setTimeout(() => this.play(), 2000);
  }

  // play animation
  play() {
    this.marker.play();
  }

  // pause animation
  pause() {
    this.marker.pause();
  }

  // reset animation
  reset() {
    this.marker.reset();
  }

  // jump to next location
  next() {
    this.marker.next();
  }

  // jump to previous location
  prev() {
    this.marker.prev();
  }

  // fast forward
  fast() {
    this.speedMultiplier *= 2;
    this.marker.setSpeedMultiplier(this.speedMultiplier);
  }

  // slow motion
  slow() {
    this.speedMultiplier /= 2;
    this.marker.setSpeedMultiplier(this.speedMultiplier);
  }

  initEvents() {
    this.marker.event.onEvent((event: EventType, data: TravelData) => {
      console.log(event, data);
    });
  }
}

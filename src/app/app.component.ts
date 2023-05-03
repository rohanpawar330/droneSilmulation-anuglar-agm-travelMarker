import { Component, NgZone, ViewChild } from '@angular/core';
import { EventType, TravelData, TravelMarker, TravelMarkerOptions } from 'travel-marker';
import { locationData } from './map-location-points/location.data';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AgmMap } from '@agm/core';
import { HttpClient } from '@angular/common/http';


declare const google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private fb: FormBuilder, private ngZone: NgZone, private http: HttpClient) { }

  // google maps zoom level
  zoom: number = 12;

  longitude?: number = undefined;
  latitude?: number = undefined;
  map: any;
  line: any;
  marker: any;
  uploaded = false

  // speedMultiplier to control animation speed
  speedMultiplier = 1;
  selectedFile: File | any;
  form: FormGroup = this.fb.group(
    {
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
    });

  locationDataList = locationData;
  // initial center position for the map
  lat: number = locationData[0][0];
  lng: number = locationData[0][1];
  refreshMap = true;

  /**
   * 
   * @param map map event when map is ready
   */
  onMapReady(map: any) {
    this.map = map;
    this.directionForDrone();
  }

  /**
   * to upload the json data 
   * @param event selected file
   */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const contents = reader.result as string;
      const jsonData = JSON.parse(contents);
      console.log(jsonData);
      this.uploaded = true;
      this.locationDataList = [...jsonData];
      this.lat = this.locationDataList[0][0]
      this.lng = this.locationDataList[0][1]
      this.reinitMap();
    };
  }

  /**
   * start & end point used agm libraray
   */
  directionForDrone() {
    const locationArray = this.locationDataList.map(
      (l) => new google.maps.LatLng(l[0], l[1])
    );
    this.line = new google.maps.Polyline({
      strokeOpacity: 0.5,
      path: [],
      map: this.map,
    });

    locationArray.forEach((l) => this.line.getPath().push(l));
    const lastPoint = this.locationDataList[this.locationDataList.length - 1]
    const start = new google.maps.LatLng(this.locationDataList[0][0], this.locationDataList[0][1]);
    const end = new google.maps.LatLng(lastPoint[0], lastPoint[1]);

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

  // drone motion used thirdparty libraray i.e.travel marker
  initRoute() {
    const route = this.line.getPath().getArray();
    const options: TravelMarkerOptions = {
      map: this.map,
      speed: 1000,
      interval: 10,
      speedMultiplier: this.speedMultiplier,
      markerOptions: {
        title: 'Travel Marker',
        animation: google.maps.Animation.DROP,
        icon: {
          url: './assets/icons/drone.svg',
          animation: google.maps.Animation.DROP,
          scaledSize: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(22, 30),
        },
      },
    };
    this.marker = new TravelMarker(options);
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

  /**
   * get the points entered by user and add to location data
   * enterd point is pused to 2nd place we can make calculation and based on requirenment
   * push at specific place
   */
  onSubmit(): void {
    const values = this.getFieldValues();
    this.locationDataList = [locationData[0], [values.longitude, values.latitude], ...locationData.slice(1)];
    console.log(this.locationDataList);
    this.reinitMap(); // call the function to reinitialize the map
  }
  
  /**
   * re initalise map
   */
  reinitMap() {
    this.refreshMap = false
    setTimeout(() => {
      this.refreshMap = true
    }, 1000);
  }


  clearForm(): void {
    this.form.reset();
  }

  private getFieldValues(values: any = {}): any {
    Object.keys(this.form.controls).forEach((fieldName) => {
      const control = this.form.get(fieldName);
      if (control instanceof FormControl) {
        values[fieldName] = control.value;
      }
    });
    return values;
  }
}

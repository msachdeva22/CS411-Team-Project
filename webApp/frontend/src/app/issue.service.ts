import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherPlaylist {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {
  }

  addPreference(title: string, mood: string, weather: string, genre: string) {
    const pref = {
      title: title,
      mood: mood,
      weather: weather,
      genre: genre
    };
    return this.http.post(`${this.uri}/issues/add`, pref);
  }

  getPref() {
    return this.http.get(`${this.uri}/issues`);
  }

  getPrefById(id: any) {
    return this.http.get(`${this.uri}/issues/${id}`);
  }

  updatePref(id: string, title: string, mood: string, weather: string, genre: string, status: string) {
    const pref = {
      title: title,
      mood: mood,
      weather: weather,
      genre: genre,
      status: status
    };
    return this.http.post(`${this.uri}/issues/update/${id}`, pref);
  }

  deletePref(id: any) {
    return this.http.get(`${this.uri}/issues/delete/${id}`);
  }
}

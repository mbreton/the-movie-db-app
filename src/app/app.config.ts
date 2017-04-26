import { InjectionToken }   from '@angular/core';

export interface IConfig{
    apiKey      : string
    host        : string
    apiVersion  : string
} 

export const APP_CONFIG = new InjectionToken<IConfig>("app.config");

export const config : IConfig = {
    apiKey      : "231d98867891ed95fd0556943ec70ff2",
    host        : "https://api.themoviedb.org",
    apiVersion  : "3"
}
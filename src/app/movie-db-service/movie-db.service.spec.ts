import {ReflectiveInjector} from '@angular/core';
import {async, fakeAsync, tick} from '@angular/core/testing';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
import {Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { APP_CONFIG, config, IConfig }     from '../app.config';
import { MovieDbService } from './movie-db.service';
import { fakeData1 } from '../fake.data';

describe('MovieDbService', () => {

  beforeEach(() => {
    this.injector = ReflectiveInjector.resolveAndCreate([
      
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      Http,
      MovieDbService,
      { provide: APP_CONFIG, useValue: <IConfig>{ host: "foo", apiVersion : "42", apiKey: "toto"} }
    ]);
    this.movieDbService = this.injector.get(MovieDbService);
    this.backend = this.injector.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
  });

  it('getMovies() should query current service url', () => {
    this.movieDbService.getMovies();
    expect(this.lastConnection).toBeDefined('no http service connection at all?');
    expect(this.lastConnection.request.url).toMatch(/foo\/42\/(.*)&api_key=toto$/, 'url invalid');
  });

  it('getMovies() should return some movies', fakeAsync(() => {
       let result: any[];
       this.movieDbService.getMovies()
                          .subscribe(
                            movies => result = movies 
                          );
       this.lastConnection.mockRespond(new Response(new ResponseOptions({
         body: JSON.stringify(fakeData1),
       })));
       tick();
       expect(result.length).toEqual(1, 'should contain given amount of movies');
       expect(result[0]).toEqual({ 
                                    "poster_path": "/tWqifoYuwLETmmasnGHO7xBjEtt.jpg",
                                    "id": 321612,
                                    "title": "Beauty and the Beast",
                                 }, 'MOVIE_ONE should be the first MOVIE');
  }));

  it('getMovies() should throw an error on response structure', fakeAsync(() => {
       let error: Error;
       this.movieDbService.getMovies().subscribe( data => {}, err => error = err, () => {} );
       this.lastConnection.mockRespond(new Response(new ResponseOptions({
         body: JSON.stringify({}),
       })));
       tick();
       expect(error.message).toEqual('Invalid JSON structure', 'JSON structure should be invalid');
  }));

  it('getMovies() should throw an error 500', fakeAsync(() => {
       let error: Error;
       this.movieDbService.getMovies().subscribe( data => {}, err => error = err, () => {} );
       this.lastConnection.mockError(new Error("Une belle erreur"));
       tick();
       expect(error.message).toEqual('Could not reach Tmdb', 'Tmdb should not be up');
  }));

  // it('should retrieve a list of movies when I call getMovies', inject([MovieDbService], (service: MovieDbService) => {
  //   expect(service).toBeTruthy();
  // }));
});

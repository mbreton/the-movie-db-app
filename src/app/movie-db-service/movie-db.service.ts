import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { APP_CONFIG, IConfig } from '../app.config';

@Injectable()
export class MovieDbService {

  constructor(private http : Http, @Inject(APP_CONFIG) private config : IConfig ) { }

  getMovies() : Observable<any> {
    let url = `${this.config.host}/${this.config.apiVersion}/discover/movie?sort_by=popularity.desc&api_key=${this.config.apiKey}`
    return this.http.get(url)
      .catch(error => { throw new Error('Could not reach Tmdb')})
      .map((res:Response) => res.json())
      .map(({results}) => {
        if (!results) { throw new Error('Invalid JSON structure')}
        return results.map( rawMovie => {
          const {title, id, poster_path} = rawMovie;
          if (!(title && id && poster_path)) {
            console.log('Passe dans if', rawMovie)
            throw new Error('Invalid JSON structure');
          }
          return {title, id, poster_path};
        })
      });
  }

  private handleError(error : Response)
  {
    return Observable.throw(error.json().error || "Server Error" );
  }

}
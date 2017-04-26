import { TheMovieDbAppPage } from './app.po';

describe('the-movie-db-app App', () => {
  let page: TheMovieDbAppPage;

  beforeEach(() => {
    page = new TheMovieDbAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

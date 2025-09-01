import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call generateToken and return token', () => {
    const mockToken = { token: 'abc123' };
    const loginData = { username: 'test', password: 'pass' };

    service.generateToken(loginData).subscribe(res => {
      expect(res).toEqual(mockToken);
    });

    const req = httpMock.expectOne('http://localhost:8080/generate-token'); // match your service's URL
    expect(req.request.method).toBe('POST');
    req.flush(mockToken);
  });

  it('should store token in localStorage when loginUser is called', () => {
    const token = 'abc123';
    service.loginUser(token);
    expect(localStorage.getItem('token')).toBe(token);
  });
});

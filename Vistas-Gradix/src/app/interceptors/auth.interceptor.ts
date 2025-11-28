import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('gradix_token');

  // Si existe token y la petición es a la API, añadir el header Authorization
  if (token && req.url.includes('/api/')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Si no hay token o no es petición a API, continuar sin modificar
  return next(req);
};

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from 'src/app/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos = 0;

  constructor(public http: HttpClient, public _usuarioService: UsuarioService) { }

  cargarMedicos() {
    const url = URL_SERVICIOS + '/medico';

    return this.http.get(url).pipe(map((resp: any) => {
      this.totalMedicos = resp.total;
      return resp.medicos;
    }));
  }

  cargarMedico(id: string) {
    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url).pipe(map((resp: any) => {
      return resp.medico;
    }));

  }

  buscarMedico(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get(url)
      .pipe(map((resp: any) => {
        return resp.medicos;
      }));
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;
    // Cuando no quede un medico en la lista regresar al listado principal
    return this.http.delete(url).pipe(map((resp: any) => {
      swal('Médico borrado', 'El médico a sido eliminado correctamente', 'success');
      return true;
    }));
  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if (medico._id) {
      // Actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put(url, medico).pipe(map((resp: any) => {
        swal('Médico actualizado', medico.nombre, 'success');
        return resp.medico;
      }));

    } else {
      // Creando
      url += '?token=' + this._usuarioService.token;

      return this.http.post(url, medico).pipe(map((resp: any) => {
        swal('Médico creado', medico.nombre, 'success');
        return resp.medico;
      }));
    }
  }
}

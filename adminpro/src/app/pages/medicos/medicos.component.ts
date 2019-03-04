import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  totalRegistros = 0;
  cargando = true;
  desde = 0;

  constructor(public _medicoService: MedicoService,
    public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;

    this._medicoService.cargarMedicos()
    .subscribe(medicos => {
      this.medicos = medicos;
      this.totalRegistros = this._medicoService.totalMedicos;
      this.cargando = false;
    });
  }

  borrarMedico(medico: Medico) {
    this._medicoService.borrarMedico(medico._id)
    .subscribe(() => this.cargarMedicos());
  }

  buscarMedico(termino: string) {

    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    this._medicoService.buscarMedico(termino)
    .subscribe(medicos => {
      this.medicos = medicos;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;

    this.cargarMedicos();
  }
}

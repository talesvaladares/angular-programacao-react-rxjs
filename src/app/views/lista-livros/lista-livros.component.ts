import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, EMPTY, filter, map, Subscription, switchMap, throwError } from 'rxjs';
import { Item, Livro, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  // listaLivros: Livro[];
  campoBusca =  new FormControl();
  mensagemErro = '';
  // subscription: Subscription;
  // livro: Livro;

  livrosResultado: LivrosResultado;

  private readonly PAUSA = 300;

  constructor(
    private livroService: LivroService
    ) {

    }

  totalLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(this.PAUSA),
    filter(valorDigitado => valorDigitado.length >= 3),
    switchMap(valorDigitado => this.livroService.buscar(valorDigitado)),
    map(response => this.livrosResultado = response),
    catchError((error) => {
      console.error(error)
      return throwError(() => new Error(this.mensagemErro = 'ops, ocorreu um erro. Recarregue a aplicação'))
      // this.mensagemErro = 'ops, deu erro!';
      // return EMPTY;
    })
  )

  livrosEncontrados$  = this.campoBusca.valueChanges.pipe(
    debounceTime(this.PAUSA),
    filter(valorDigitado => valorDigitado.length >= 3),
    switchMap(valorDigitado => this.livroService.buscar(valorDigitado)),
    map(response => response.items ?? []),
    map(items => this.livroResultadoParaLivros(items)),
    catchError((error) => {
      console.error(error)
      return throwError(() => new Error(this.mensagemErro = 'ops, ocorreu um erro. Recarregue a aplicação'))
      // this.mensagemErro = 'ops, deu erro!';
      // return EMPTY;
    })
  )

  // buscarLivros() {
  //   this.subscription = this.livroService.buscar(this.campoBusca).subscribe({
  //     next: (items) => {
  //       this.listaLivros = this.livroResultadoParaLivros(items);
  //     },
  //     error: error => console.error(error),
  //     complete: () => {console.log('fim')}
  //   });
  // }

  livroResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

}




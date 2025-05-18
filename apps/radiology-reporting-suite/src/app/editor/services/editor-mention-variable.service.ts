import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { EditorMentionVariableItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class EditorMentionVariableService {
  private readonly _isLoading: WritableSignal<boolean> = signal<boolean>(true);

  private readonly _variables: WritableSignal<EditorMentionVariableItem[]> =
    signal<EditorMentionVariableItem[]>([]);

  get isLoading(): Signal<boolean> {
    return this._isLoading;
  }

  set isLoading(isLoading: boolean) {
    this._isLoading.set(isLoading);
  }

  get variables(): Signal<EditorMentionVariableItem[]> {
    return this._variables;
  }

  set variables(variables: EditorMentionVariableItem[]) {
    this._variables.set(variables);
  }
}

'use babel';

import AtomGhostView from './atom-ghost-view'
import { CompositeDisposable } from 'atom'
import * as openUrl from 'openurl'

export default {

  atomGhostView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomGhostView = new AtomGhostView(state.atomGhostViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomGhostView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-ghost:open-in-ghost': () => this.openInGhost()
    }));
  },

  deactivate() {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.atomGhostView.destroy()
  },

  serialize() {
    return {
      atomGhostViewState: this.atomGhostView.serialize()
    };
  },

  openInGhost() {
    console.log('AtomGhost was activated!');

    this.modalPanel.show()

    setTimeout(() => this.modalPanel.hide(), 3000)

    const editor = atom.workspace.getActiveTextEditor()

    if (editor) {
      const content = encodeURIComponent(editor.getText())
      const title = encodeURIComponent(editor.getTitle())

      if (!content && !title) return

      openUrl.open(`ghost://create-draft/?title=${title}&content=${content}`)
    }
  }

};

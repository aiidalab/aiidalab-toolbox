import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
  ILabShell
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';

// import { WidgetTracker } from '@jupyterlab/apputils';
import { AiidalabSidebar } from './sidebar';

/**
 * Initialization data for the osscar-labextensions extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'aiidalab-labextensions',
  autoStart: true,
  activate: activate,
  requires: [INotebookTracker, ILabShell, ILayoutRestorer]
};

function activate(
  app: JupyterFrontEnd,
  notebookTracker: INotebookTracker,
  // restorer: ILayoutRestorer,
  labShell: ILabShell
): void {
  const sidebar = new AiidalabSidebar(notebookTracker);

  sidebar.id = 'AiiDAlab-ID';
  sidebar.title.iconClass = 'aiidalab-Logo jp-SideBar-tabIcon';
  sidebar.title.caption = 'AiiDAlab';

  // restorer.add(sidebar, sidebar.id);
  labShell.add(sidebar, 'left', { rank: 700 });
}

export default extension;

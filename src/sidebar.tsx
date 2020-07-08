import { Widget, PanelLayout } from '@lumino/widgets';

import { ReactWidget } from '@jupyterlab/apputils';

import { INotebookTracker } from '@jupyterlab/notebook';

import { CodeCell } from '@jupyterlab/cells';

import { OutputArea } from '@jupyterlab/outputarea';

import * as React from 'react';

// import $ from "jquery";
// import * as _ from "underscore";

export class AiidalabSidebar extends Widget {
  private _notebookTracker: INotebookTracker;
  // private _hr: HTMLElement;
  private _Layout: PanelLayout;
  private _outputarea: OutputArea;
  private _text: string;
  private _parameters: IStructureManagerWidget = {
    header:
      'from aiidalab_widgets_base import CodQueryWidget, SmilesWidget, StructureExamplesWidget\n' +
      'from aiidalab_widgets_base import StructureBrowserWidget, StructureManagerWidget, StructureUploadWidget\n' +
      'from aiidalab_widgets_base import BasicStructureEditor\n\n\n' +
      'widget = StructureManagerWidget(\n',
    importers: ['\timporters=[\n'],
    editors: ['\teditors = [\n'],
    enableExample: false,
    footer: ')\n\ndisplay(widget)'
  };

  constructor(notebookTracker: INotebookTracker) {
    super();
    this.addClass('aiidalab-Sidebar');
    const layout = (this.layout = new PanelLayout());
    this._Layout = layout;
    this._notebookTracker = notebookTracker;

    const aiidalabbaseWidget = ReactWidget.create(
      <div>
        <div className="my-div">
          <input
            className="button blue"
            type="button"
            title="AiiDA lab base widget"
            value="Generate GUI"
            style={{
              marginTop: '10px',
              marginLeft: '20px'
            }}
            // value="Open periodic table"
            draggable={true}
            onDragOver={ev => {
              ev.preventDefault();
            }}
            onDragStart={ev =>
              ev.dataTransfer.setData(
                'text',
                this._parameters.header + this._parameters.footer
              )
            }
            onClick={() => {
              const current = this._notebookTracker.currentWidget;

              if (current) {
                current.content.widgets.forEach(cell => {
                  if (
                    current.content.isSelectedOrActive(cell) &&
                    cell.model.type === 'code'
                  ) {
                    this._text = this._parameters.header;
                    if (
                      this._parameters.importers.length > 1 ||
                      this._parameters.enableExample === true
                    ) {
                      for (
                        let i = 0;
                        i < this._parameters.importers.length;
                        i++
                      ) {
                        this._text = this._text + this._parameters.importers[i];
                      }
                      if (this._parameters.enableExample === true) {
                        const exname = document.getElementById(
                          'example-name'
                        ) as HTMLInputElement;
                        const exurl = document.getElementById(
                          'example-url'
                        ) as HTMLInputElement;

                        this._text =
                          this._text +
                          '\t\tStructureExamplesWidget(\n' +
                          '\t\t\ttitle="From Examples",\n' +
                          '\t\t\texamples=[("' +
                          exname.value +
                          '","' +
                          exurl.value +
                          '")]),\n';
                      }

                      this._text = this._text + '\t\t],\n';
                    }
                    if (this._parameters.editors.length > 1) {
                      for (
                        let i = 0;
                        i < this._parameters.editors.length;
                        i++
                      ) {
                        this._text = this._text + this._parameters.editors[i];
                      }
                      this._text = this._text + '\t\t],\n';
                    }
                    this._text = this._text + this._parameters.footer;
                    cell.model.value.text = this._text;
                    CodeCell.execute(cell as CodeCell, current.sessionContext);
                    this._Layout.removeWidgetAt(-1);
                    this._Layout.removeWidgetAt(-1);
                    this._Layout.addWidget(importers);
                    this._Layout.addWidget(editors);
                    this._outputarea = (cell as CodeCell).outputArea;
                    this._parameters.importers = [
                      this._parameters.importers[0]
                    ];
                    this._parameters.editors = [this._parameters.editors[0]];

                    // this.addOutputarea();
                  }
                });
              }
            }}
          />
        </div>
        <hr />
      </div>
    );

    const importers = ReactWidget.create(
      <form>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="checkbox-1"
              value=""
              onClick={() => {
                const checkBox = document.getElementById(
                  'checkbox-1'
                ) as HTMLInputElement;
                if (checkBox.checked === true) {
                  this._parameters.importers.push(
                    '\t\tStructureUploadWidget(title="From computer"),\n'
                  );
                }
              }}
            />
            From computer
          </label>
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="checkbox-2"
              value=""
              onClick={() => {
                const checkBox = document.getElementById(
                  'checkbox-2'
                ) as HTMLInputElement;
                if (checkBox.checked === true) {
                  this._parameters.importers.push(
                    '\t\tCodQueryWidget(title="COD"),\n'
                  );
                }
              }}
            />
            COD
          </label>
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="checkbox-3"
              value=""
              onClick={() => {
                const checkBox = document.getElementById(
                  'checkbox-3'
                ) as HTMLInputElement;
                if (checkBox.checked === true) {
                  this._parameters.importers.push(
                    '\t\tStructureBrowserWidget(title="AiiDA database"),\n'
                  );
                }
              }}
            />
            AiiDA database
          </label>
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="checkbox-4"
              value=""
              onClick={() => {
                const checkBox = document.getElementById(
                  'checkbox-4'
                ) as HTMLInputElement;
                if (checkBox.checked === true) {
                  this._parameters.importers.push(
                    '\t\tSmilesWidget(title="SMILES"),\n'
                  );
                }
              }}
            />
            SMILES
          </label>
          <hr />
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="checkbox-5"
              value=""
              onClick={() => {
                const checkBox = document.getElementById(
                  'checkbox-5'
                ) as HTMLInputElement;
                if (checkBox.checked === true) {
                  this._parameters.enableExample = true;
                } else {
                  this._parameters.enableExample = false;
                }
              }}
            />
            Structure example
          </label>
        </div>
        <label>Structure name:</label>
        <br />
        <input
          type="text"
          id="example-name"
          value="Silicon oxide"
          style={{
            backgroundColor: 'black',
            color: 'white',
            marginLeft: '15px'
          }}
        />
        <br />
        <label>Path:</label>
        <br />
        <input
          type="text"
          id="example-url"
          value="miscellaneous/structures/SiO2.xyz"
          style={{
            backgroundColor: 'black',
            color: 'white',
            marginLeft: '15px'
          }}
        />
        <br />
        <hr />
      </form>
    );

    const editors = ReactWidget.create(
      <form>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="checkbox-a"
              value=""
              onClick={() => {
                const checkBox = document.getElementById(
                  'checkbox-a'
                ) as HTMLInputElement;
                if (checkBox.checked === true) {
                  this._parameters.importers.push(
                    '\t\tBasicStructureEditor(title="Basic Editor"),\n'
                  );
                }
              }}
            />
            Basic structure editor
          </label>
        </div>
      </form>
    );

    layout.addWidget(aiidalabbaseWidget);
    layout.addWidget(importers);
    layout.addWidget(editors);

    const a: HTMLElement = document.createElement('hr');
    layout.parent.node.appendChild(a);
  }

  addOutputarea() {
    this._Layout.addWidget(this._outputarea);
  }
}

export interface IStructureManagerWidget {
  header: string;
  importers: string[];
  editors: string[];
  enableExample: boolean;
  footer: string;
}

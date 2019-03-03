import { Component, OnInit } from '@angular/core';
import { HistoryGraphComponent } from '@app/components/graphs/history-graph/history-graph.component';
import { EventService } from '@app/services/event.service';

import {NgModule, ViewChild, ElementRef, Input, Output, 
        EventEmitter, ViewContainerRef, ComponentRef, 
        ComponentFactoryResolver, ReflectiveInjector} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';


@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.scss']
})
export class GraphContainerComponent implements OnInit {
  @ViewChild('historyGraph', {read: ViewContainerRef}) 
    private _HistoryGraphComponentRef;
  private historyGraphComponent: HistoryGraphComponent;

  constructor(private eventService: EventService,
              private _cmpFctryRslvr: ComponentFactoryResolver) { }

  ngOnInit() {
    this.eventService.reloadGraphsEvent.register(() => this.reloadGraphs()); 

    let _comp = this.createComponent(this._HistoryGraphComponentRef, HistoryGraphComponent);

    // all inputs/outputs set => add it to the DOM ..
    this._HistoryGraphComponentRef.insert(_comp.hostView);
    this.historyGraphComponent = _comp.instance;
  }

  public createComponent (vCref: ViewContainerRef, type: any): ComponentRef<any> {

    let factory = this._cmpFctryRslvr.resolveComponentFactory(type);

    // vCref is needed cause of that injector..
    let injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);

    // create component without adding it directly to the DOM
    let comp = factory.create(injector);

    return comp;
  }
  
  reloadGraphs() {
    console.log(this.historyGraphComponent);
    console.log('GraphContainer: reload() event received.')
    this.historyGraphComponent.reload();
  }

}

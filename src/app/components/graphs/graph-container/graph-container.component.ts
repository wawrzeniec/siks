import { Component, OnInit } from '@angular/core';
import { HistoryGraphComponent } from '@app/components/graphs/history-graph/history-graph.component';
import { BreakdownGraphComponent } from '@app/components/graphs/breakdown-graph/breakdown-graph.component';
import { EventService } from '@app/services/event.service';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule, ViewChild, ElementRef, Input, Output, 
        EventEmitter, ViewContainerRef, ComponentRef, 
        ComponentFactoryResolver, ReflectiveInjector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.scss']
})
export class GraphContainerComponent implements OnInit {
  @ViewChild('historyGraph', {read: ViewContainerRef}) 
    private _HistoryGraphComponentRef;
  private historyGraphComponent: HistoryGraphComponent;

  @ViewChild('breakdownGraph', {read: ViewContainerRef}) 
    private _BreakdownGraphComponentRef;
  private breakdownGraphComponent: BreakdownGraphComponent;

  selectedTab: number = 0;

  constructor(private eventService: EventService,
              private _cmpFctryRslvr: ComponentFactoryResolver) { }

  ngOnInit() {
    this.eventService.reloadGraphsEvent.register(() => this.reloadGraphs()); 

    /* Creates the histogry graph component */
    let _comp = this.createComponent(this._HistoryGraphComponentRef, HistoryGraphComponent);

    // all inputs/outputs set => add it to the DOM ..
    this._HistoryGraphComponentRef.insert(_comp.hostView);
    this.historyGraphComponent = _comp.instance;

    /* Creates the breakdown graph component */
    _comp = this.createComponent(this._BreakdownGraphComponentRef, BreakdownGraphComponent);

    // all inputs/outputs set => add it to the DOM ..
    this._BreakdownGraphComponentRef.insert(_comp.hostView);
    this.breakdownGraphComponent = _comp.instance;
  }

  public createComponent (vCref: ViewContainerRef, type: any): ComponentRef<any> {

    let factory = this._cmpFctryRslvr.resolveComponentFactory(type);

    // vCref is needed cause of that injector..
    let injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);

    // create component without adding it directly to the DOM
    let comp = factory.create(injector);

    return comp;
  }
  
  onSelectChange() {
    switch(this.selectedTab) {
      case 0:
        this.historyGraphComponent.reDisplay();
      case 1:
      this.breakdownGraphComponent.reDisplay();
    }
  }

  reloadGraphs() {
    console.log('GraphContainer: reload() event received.')
    this.historyGraphComponent.reDisplay();
    this.breakdownGraphComponent.reload();
  }

}

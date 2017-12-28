/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojknockout'], function(oj, ko, $, app) {
  function viewModel(params) {

    var self = this;

    self.handleActivated = function() {

      var parentRouter = params['ojRouter']['parentRouter'];

      var routerConfigOptions = {
        'incidentTabSummary': { label: 'Summary', isDefault: true },
        'incidentTabActivity': { label: 'Activities' },
        'incidentTabMap': { label: 'Map'},
        'priority':  { label: 'Priority' },
        'status': { label: 'Status' }
      };

      self.router = parentRouter.createChildRouter('incidentView').configure(routerConfigOptions);

      // hide or show the navigation btn
      self.router.stateId.subscribe(function(newValue) {
        if(newValue === 'incidentTabMap') {
          showNavBtn(true)
        } else {
          showNavBtn(false)
        }
      })

      self.router.moduleConfig['params']['locationId'] = params['locationId'];

      self.previousTab = null;

      self.moduleConfig = ko.pureComputed(function () {
        var tabAnimations = {
          'navSiblingEarlier': oj.ModuleAnimations.createAnimation({'effect':'slideOut','direction':'start','persist':'all'}, {'effect':'slideIn','direction':'start'}, false),
          'navSiblingLater': oj.ModuleAnimations.createAnimation({'effect':'slideOut','direction':'end','persist':'all'}, {'effect':'slideIn','direction':'end'}, false)
        };

        var animation = null;

        // determine animation type based on current and previous tab
        switch(self.previousTab) {
          case 'incidentTabSummary':
            animation = tabAnimations['navSiblingEarlier']
            break;
          case 'incidentTabActivity':
            if(self.router.stateId() === 'incidentTabSummary') {
              animation = tabAnimations['navSiblingLater']
            } else {
              animation = tabAnimations['navSiblingEarlier']
            }
            break;
          case 'incidentTabMap':
            animation = tabAnimations['navSiblingLater']
        }

        // add cacheKey to cache views when navigating tabs
        return {
          params: self.router.moduleConfig.params,
          name: self.router.stateId(),
          cacheKey: self.router.stateId(),
          animation: animation
        };
      })

      // var switcherCallback = function(context) {
      //   return app.pendingAnimationType;
      // };
      //
      // var mergeConfig = function(original) {
      //   return $.extend(true, {}, original, {
      //     'animation': oj.ModuleAnimations.switcher(switcherCallback),
      //     'cacheKey': self.router.currentValue()
      //   });
      // };

      // pass animation to module transition
      // self.moduleConfig = mergeConfig(self.router.moduleConfig);

      return oj.Router.sync();
    };

    // go to priority selection with drillIn animation
    self.goToPriority = function() {
      app.pendingAnimationType = 'navChild';
      self.router.go('priority');
    };

    // go to status selection with drillIn animation
    self.goToStatus = function() {
      app.pendingAnimationType = 'navChild';
      self.router.go('status');
    };

    // handler for back button click
    self.goToPrevious = function() {
      var state = self.router.currentState().id;
      // set drill out animation

      // todo investigate pull-to-refresh and android drill in/out animation
      app.pendingAnimationType = 'navParent';

      if( state === 'priority' || state === 'status') {
        // go back to incident summary
        window.history.back();
      } else {
        // go back to incidents
        app.goToIncidents();
      }
    };

    var showNavBtn = ko.observable(false);

    // incident page header settings
    self.incidentHeaderSettings = {
      name:'basicHeader',
      params: {
        title: 'Incident',
        startBtn: {
          id: 'backBtn',
          click: self.goToPrevious,
          display: 'icons',
          label: 'Back',
          icons: 'oj-hybrid-applayout-header-icon-back oj-fwk-icon',
          visible: true
        },
        endBtn: {
          id: 'navigateBtn',
          click: '',
          display: 'icons',
          label: 'Navigate',
          icons: 'demo-location-icon-24 demo-icon-font-24 oj-fwk-icon',
          visible: showNavBtn
        }
      }
    };

    // update animation based on nav tabs selction change
    self.navBarChange = function(event) {
      self.previousTab = event.detail.previousValue;
    };
  }

  return viewModel;
});

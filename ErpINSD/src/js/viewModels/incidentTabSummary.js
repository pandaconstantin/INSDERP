/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['jquery', 'appController', 'ojs/ojknockout', 'ojs/ojlistview'], function($, app) {
  function summaryViewModel() {
    var self = this;

    // adjust content padding top
    self.handleAttached = function(info) {
      var tabs = document.getElementById('incidentsNavTabs');
      oj.Context.getContext(tabs).getBusyContext().whenReady().then(function () {
          app.appUtilities.adjustContentPadding();
      });
    };

    self.handleBindingsApplied = function(info) {
      if (app.pendingAnimationType === 'navParent' || app.pendingAnimationType === 'navChild') {
        app.preDrill();
      }
    };

    self.handleTransitionCompleted = function(info) {
      if (app.pendingAnimationType === 'navParent' || app.pendingAnimationType === 'navChild') {
        app.postDrill();
      }
    };

    // trigger click when selection changes
    self.optionChange = function (event) {
      var detail = event.detail;
      if(detail.items[0]) {
        $(detail.items[0]).trigger('click');
      }
    };

  }

  return summaryViewModel;
});

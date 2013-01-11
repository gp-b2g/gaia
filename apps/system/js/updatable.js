'use strict';

/*
 * An Updatable object represents an application *or* system update.
 * It takes care of the interaction with the UpdateManager and observes
 * the update itself to handle success/error cases.
 *
 * - name of the update
 * - size of the update
 * - download() to start the download
 * - cancelDownload() to cancel it
 */

/* === App Updates === */
function AppUpdatable(app) {
  this._mgmt = navigator.mozApps.mgmt;
  this.app = app;

  var manifest = app.manifest ? app.manifest : app.updateManifest;
  this.name = new ManifestHelper(manifest).name;

  this.size = app.updateManifest ? app.updateManifest.size : null;
  this.progress = null;

  UpdateManager.addToUpdatableApps(this);
  app.ondownloadavailable = this.availableCallBack.bind(this);
  if (app.downloadAvailable) {
    this.availableCallBack();
  }
}

AppUpdatable.prototype.download = function() {
  UpdateManager.addToDownloadsQueue(this);
  this.progress = 0;

  this.app.download();
};

AppUpdatable.prototype.cancelDownload = function() {
  this.app.cancelDownload();
  UpdateManager.removeFromDownloadsQueue(this);
};

AppUpdatable.prototype.uninit = function() {
  this.app.ondownloadavailable = null;
  this.clean();
};

AppUpdatable.prototype.clean = function() {
  this.app.ondownloaderror = null;
  this.app.ondownloadsuccess = null;
  this.app.ondownloadapplied = null;
  this.app.onprogress = null;

  this.progress = null;
};

AppUpdatable.prototype.availableCallBack = function() {
  this.size = this.app.updateManifest ?
    this.app.updateManifest.size : null;

  if (this.app.installState === 'installed') {
    UpdateManager.addToUpdatesQueue(this);

    // we add these callbacks only now to prevent interfering
    // with other modules (especially the AppInstallManager)
    this.app.ondownloaderror = this.errorCallBack.bind(this);
    this.app.ondownloadsuccess = this.successCallBack.bind(this);
    this.app.ondownloadapplied = this.appliedCallBack.bind(this);
    this.app.onprogress = this.progressCallBack.bind(this);
  }
};

AppUpdatable.prototype.successCallBack = function() {
  var app = this.app;
  if (WindowManager.getDisplayedApp() !== app.origin) {
    this.applyUpdate();
  } else {
    var self = this;
    window.addEventListener('appwillclose', function waitClose() {
      window.removeEventListener('appwillclose', waitClose);
      self.applyUpdate();
    });
  }

  UpdateManager.removeFromDownloadsQueue(this);
  UpdateManager.removeFromUpdatesQueue(this);
};

AppUpdatable.prototype.applyUpdate = function() {
  WindowManager.kill(this.app.origin);
  this._mgmt.applyDownload(this.app);
};

AppUpdatable.prototype.appliedCallBack = function() {
  this.clean();
};

AppUpdatable.prototype.errorCallBack = function(e) {
  var errorName = e.application.downloadError.name;
  console.info('downloadError event, error code is', errorName);
  UpdateManager.requestErrorBanner();
  UpdateManager.removeFromDownloadsQueue(this);
  this.progress = null;
};

AppUpdatable.prototype.progressCallBack = function() {
  if (this.progress === null) {
    // this is the first progress
    UpdateManager.addToDownloadsQueue(this);
    this.progress = 0;
  }

  var delta = this.app.progress - this.progress;

  this.progress = this.app.progress;
  UpdateManager.downloadProgressed(delta);
};

/*
 * System Updates
 * Will be instanciated only once by the UpdateManager
 *
 */
function SystemUpdatable() {
  var _ = navigator.mozL10n.get;
  this.name = _('systemUpdate');
  this.size = 0;
  this.downloading = false;
  this.paused = false;
  window.addEventListener('mozChromeEvent', this);
}

SystemUpdatable.prototype.download = function() {
  if (this.downloading) {
    return;
  }

  this.downloading = true;
  this.paused = false;
  this._dispatchEvent('update-available-result', 'download');
  UpdateManager.addToDownloadsQueue(this);
  this.progress = 0;
};

SystemUpdatable.prototype.cancelDownload = function() {
  this._dispatchEvent('update-download-cancel');
  UpdateManager.removeFromDownloadsQueue(this);
  this.downloading = false;
  this.paused = false;
};

SystemUpdatable.prototype.uninit = function() {
  window.removeEventListener('mozChromeEvent', this);
};

SystemUpdatable.prototype.handleEvent = function(evt) {
  if (evt.type !== 'mozChromeEvent')
    return;

  var detail = evt.detail;
  if (!detail.type)
    return;

  switch (detail.type) {
    case 'update-error':
      this.errorCallBack();
      break;
    case 'update-download-started':
      // TODO UpdateManager glue
      this.paused = false;
      break;
    case 'update-download-progress':
      var delta = detail.progress - this.progress;
      this.progress = detail.progress;

      UpdateManager.downloadProgressed(delta);
      break;
    case 'update-download-stopped':
      // TODO UpdateManager glue
      this.paused = detail.paused;
      if (!this.paused) {
        UpdateManager.startedUncompressing();
      }
      break;
    case 'update-downloaded':
      this.downloading = false;
      this.showApplyPrompt();
      break;
    case 'update-prompt-apply':
      this.showApplyPrompt();
      break;
  }
};

SystemUpdatable.prototype.errorCallBack = function() {
  UpdateManager.requestErrorBanner();
  UpdateManager.removeFromDownloadsQueue(this);
  this.downloading = false;
};

SystemUpdatable.prototype.showApplyPrompt = function() {
  var _ = navigator.mozL10n.get;

  var cancel = {
    title: _('later'),
    callback: this.declineInstall.bind(this)
  };

  var confirm = {
    title: _('installNow'),
    callback: this.acceptInstall.bind(this)
  };

  UtilityTray.hide();
  CustomDialog.show(_('updateReady'), _('wantToInstall'),
                    cancel, confirm);
};

SystemUpdatable.prototype.declineInstall = function() {
  CustomDialog.hide();
  this._dispatchEvent('update-prompt-apply-result', 'wait');

  UpdateManager.removeFromDownloadsQueue(this);
};

SystemUpdatable.prototype.acceptInstall = function() {
  CustomDialog.hide();
  this._dispatchEvent('update-prompt-apply-result', 'restart');
};

SystemUpdatable.prototype._dispatchEvent = function(type, result) {
  var event = document.createEvent('CustomEvent');
  var data = { type: type };
  if (result) {
    data.result = result;
  }

  event.initCustomEvent('mozContentEvent', true, true, data);
  window.dispatchEvent(event);
};

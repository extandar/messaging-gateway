var mailServiceStatus = function() {
    var status = 'ready';

    this.setReady = function() {
        status = 'ready';
    }

    this.setBusy = function() {
        status = 'busy';
    }

    this.getCurrentStatus = function() {
        return status;
    }
}

mailServiceStatus.instance = null;

mailServiceStatus.getInstance = function() {
    if (this.instance === null) {
        this.instance = new mailServiceStatus();
    }

    return this.instance;
}

module.exports = mailServiceStatus.getInstance();
'use strict';

let CONFMAN_SERNO = 0;

export default class VertoConfMan {
    constructor(verto, params) {
        this.params = Object.assign({
            dialog: null,
            hasVid: false,
            laData: null,
            onBroadcast: null,
            onLaChange: null,
            onLaRow: null
        }, params);

        this.verto = verto;
        this.serno = CONFMAN_SERNO++;
        this.canvasCount = this.params.laData.canvasCount;
        const _this = this;

        verto.subscribe(this.params.laData.modChannel, {
            handler: function(v, e) {
                if (_this.params.onBroadcast) {
                    _this.params.onBroadcast(verto, _this, e.data);
                }
            }
        });

        verto.subscribe(this.params.laData.chatChannel, {
            handler: function(v, e) {
                if (typeof(_this.params.chatCallback) === "function") {
                    _this.params.chatCallback(v,e);
                }
            }
        });

        if (this.params.laData.role === "moderator") {
            verto.subscribe(this.params.laData.modChannel, {
                handler: function(v, e) {
                    console.error("MODDATA:", e.data);
                    if (_this.params.onBroadcast) {
                        _this.params.onBroadcast(verto, _this, e.data);
                    }

                    if (e.data["conf-command"] === "list-videoLayouts") {

                        for (var j = 0; j < this.canvasCount; j++) {
                            if (e.data.responseData) {
                            }
                        }
                    }
                }
            });

            if (this.params.hasVid) {
                this.modCommand("list-videoLayouts", null, null);
            }
        }
        // if (this.params.laData.role === "moderator")
    }

    modCommand(cmd, id, value) {
       this.verto.call("verto.broadcast", {
            "eventChannel": this.params.laData.modChannel,
            "data": {
                "application": "conf-control",
                "command": cmd,
                "id": id,
                "value": value
            }
        });
    }

    sendChat(message, type) {
        this.verto.call("verto.broadcast", {
            "eventChannel": this.params.laData.chatChannel,
            "data": {
                "action": "send",
                "message": message,
                "type": type
            }
        });
    }

    destroy() {
        this.destroyed = true;

        if (this.params.laData.chatChannel) {
            this.verto.unsubscribe(this.params.laData.chatChannel);
        }
        if (this.params.laData.modChannel) {
            this.verto.unsubscribe(this.params.laData.modChannel);
        }
    }

    listVideoLayouts() {
        this.modCommand("list-videoLayouts", null, null);
    }

    play(file) {
        this.modCommand("play", null, file);
    }

    stop() {
        this.modCommand("stop", null, "all");
    }

    deaf(memberID) {
        this.modCommand("deaf", parseInt(memberID));
    }

    undeaf(memberID) {
        this.modCommand("undeaf", parseInt(memberID));
    }

    record(file) {
        this.modCommand("recording", null, ["start", file]);
    }

    stopRecord() {
        this.modCommand("recording", null, ["stop", "all"]);
    }

    snapshot(file) {
        if (!this.params.hasVid) {
            throw 'Conference has no video';
        }
        this.modCommand("vid-write-png", null, file);
    }

    setVideoLayout(layout, canvasID) {
        if (!this.params.hasVid) {
            throw 'Conference has no video';
        }
        if (canvasID) {
            this.modCommand("vid-layout", null, [layout, canvasID]);
        } else {
            this.modCommand("vid-layout", null, layout);
        }
    }

    kick(memberID) {
        this.modCommand("kick", parseInt(memberID));
    }

    muteMic(memberID) {
        this.modCommand("tmute", parseInt(memberID));
    }

    muteVideo(memberID) {
        if (!this.params.hasVid) {
            throw 'Conference has no video';
        }
        this.modCommand("tvmute", parseInt(memberID));
    }

    presenter(memberID) {
        if (!this.params.hasVid) {
            throw 'Conference has no video';
        }
        this.modCommand("vid-res-id", parseInt(memberID), "presenter");
    }

    videoFloor(memberID) {
        if (!this.params.hasVid) {
            throw 'Conference has no video';
        }
        this.modCommand("vid-floor", parseInt(memberID), "force");
    }

    banner(memberID, text) {
        if (!this.params.hasVid) {
            throw 'Conference has no video';
        }
        this.modCommand("vid-banner", parseInt(memberID), escape(text));
    }

    volumeDown(memberID) {
        this.modCommand("volume_out", parseInt(memberID), "down");
    }

    volumeUp(memberID) {
        this.modCommand("volume_out", parseInt(memberID), "up");
    }

    gainDown(memberID) {
        this.modCommand("volume_in", parseInt(memberID), "down");
    }

    gainUp(memberID) {
        this.modCommand("volume_in", parseInt(memberID), "up");
    }

    transfer(memberID, exten) {
        this.modCommand("transfer", parseInt(memberID), exten);
    }
}

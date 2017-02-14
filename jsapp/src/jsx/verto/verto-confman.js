'use strict';
export default class VertoConfMan {
    constructor(verto, params) {
        var confMan = this;
        confMan.params = $.extend({
            tableID: null,
            statusID: null,
            mainModID: null,
            dialog: null,
            hasVid: false,
            laData: null,
            onBroadcast: null,
            onLaChange: null,
            onLaRow: null
        }, params);
        confMan.verto = verto;
        confMan.serno = CONFMAN_SERNO++;
        confMan.canvasCount = confMan.params.laData.canvasCount;
        function genMainMod(jq) {
            var play_id = "play_" + confMan.serno;
            var stop_id = "stop_" + confMan.serno;
            var recording_id = "recording_" + confMan.serno;
            var snapshot_id = "snapshot_" + confMan.serno;
            var rec_stop_id = "recording_stop" + confMan.serno;
            var div_id = "confman_" + confMan.serno;
            var html =  "<div id='" + div_id + "'><br>" +
                "<button class='ctlbtn' id='" + play_id + "'>Play</button>" +
                "<button class='ctlbtn' id='" + stop_id + "'>Stop</button>" +
                "<button class='ctlbtn' id='" + recording_id + "'>Record</button>" +
                "<button class='ctlbtn' id='" + rec_stop_id + "'>Record Stop</button>" +
                (confMan.params.hasVid ? "<button class='ctlbtn' id='" + snapshot_id + "'>PNG Snapshot</button>" : "") +
                "<br><br></div>";
            jq.html(html);
            verto.modfuncs.change_video_layout = function(id, canvas_id) {
                var val = $("#" + id + " option:selected").text();
                if (val !== "none") {
                    confMan.modCommand("vid-layout", null, [val, canvas_id]);
                }
            };
            if (confMan.params.hasVid) {
                for (var j = 0; j < confMan.canvasCount; j++) {
                    var vlayout_id = "confman_vid_layout_" + j + "_" + confMan.serno;
                    var vlselect_id = "confman_vl_select_" + j + "_" + confMan.serno;
                    var vlhtml =  "<div id='" + vlayout_id + "'><br>" +
                    "<b>Video Layout Canvas " + (j+1) +
                    "</b> <select onChange='$.verto.modfuncs.change_video_layout(\"" + vlayout_id + "\", \"" + (j+1) + "\")' id='" + vlselect_id + "'></select> " +
                    "<br><br></div>";
                    jq.append(vlhtml);
                }
                $("#" + snapshot_id).click(function() {
                    var file = prompt("Please enter file name", "");
                    if (file) {
                        confMan.modCommand("vid-write-png", null, file);
                    }
                });
            }
            $("#" + play_id).click(function() {
                var file = prompt("Please enter file name", "");
                if (file) {
                    confMan.modCommand("play", null, file);
                }
            });
            $("#" + stop_id).click(function() {
                confMan.modCommand("stop", null, "all");
            });
            $("#" + recording_id).click(function() {
                var file = prompt("Please enter file name", "");
                if (file) {
                    confMan.modCommand("recording", null, ["start", file]);
                }
            });
            $("#" + rec_stop_id).click(function() {
                confMan.modCommand("recording", null, ["stop", "all"]);
            });
        }
        function genControls(jq, rowid) {
            var x = parseInt(rowid);
            var kick_id = "kick_" + x;
            var canvas_in_next_id = "canvas_in_next_" + x;
            var canvas_in_prev_id = "canvas_in_prev_" + x;
            var canvas_out_next_id = "canvas_out_next_" + x;
            var canvas_out_prev_id = "canvas_out_prev_" + x;
            var canvas_in_set_id = "canvas_in_set_" + x;
            var canvas_out_set_id = "canvas_out_set_" + x;
            var layer_set_id = "layer_set_" + x;
            var layer_next_id = "layer_next_" + x;
            var layer_prev_id = "layer_prev_" + x;
            var tmute_id = "tmute_" + x;
            var tvmute_id = "tvmute_" + x;
            var vbanner_id = "vbanner_" + x;
            var tvpresenter_id = "tvpresenter_" + x;
            var tvfloor_id = "tvfloor_" + x;
            var box_id = "box_" + x;
            var gainup_id = "gain_in_up" + x;
            var gaindn_id = "gain_in_dn" + x;
            var volup_id = "vol_in_up" + x;
            var voldn_id = "vol_in_dn" + x;
            var transfer_id = "transfer" + x;
            var html = "<div id='" + box_id + "'>";
            html += "<b>General Controls</b><hr noshade>";
            html += "<button class='ctlbtn' id='" + kick_id + "'>Kick</button>" +
                "<button class='ctlbtn' id='" + tmute_id + "'>Mute</button>" +
                "<button class='ctlbtn' id='" + gainup_id + "'>Gain -</button>" +
                "<button class='ctlbtn' id='" + gaindn_id + "'>Gain +</button>" +
                "<button class='ctlbtn' id='" + voldn_id + "'>Vol -</button>" +
                "<button class='ctlbtn' id='" + volup_id + "'>Vol +</button>" +
                "<button class='ctlbtn' id='" + transfer_id + "'>Transfer</button>";
            if (confMan.params.hasVid) {
                html += "<br><br><b>Video Controls</b><hr noshade>";
                html += "<button class='ctlbtn' id='" + tvmute_id + "'>VMute</button>" +
                    "<button class='ctlbtn' id='" + tvpresenter_id + "'>Presenter</button>" +
                    "<button class='ctlbtn' id='" + tvfloor_id + "'>Vid Floor</button>" +
                    "<button class='ctlbtn' id='" + vbanner_id + "'>Banner</button>";
                if (confMan.canvasCount > 1) {
                    html += "<br><br><b>Canvas Controls</b><hr noshade>" +
                    "<button class='ctlbtn' id='" + canvas_in_set_id + "'>Set Input Canvas</button>" +
                    "<button class='ctlbtn' id='" + canvas_in_prev_id + "'>Prev Input Canvas</button>" +
                    "<button class='ctlbtn' id='" + canvas_in_next_id + "'>Next Input Canvas</button>" +
                    "<br>" +
                    "<button class='ctlbtn' id='" + canvas_out_set_id + "'>Set Watching Canvas</button>" +
                    "<button class='ctlbtn' id='" + canvas_out_prev_id + "'>Prev Watching Canvas</button>" +
                    "<button class='ctlbtn' id='" + canvas_out_next_id + "'>Next Watching Canvas</button>";
                }
                html += "<br>" +
                    "<button class='ctlbtn' id='" + layer_set_id + "'>Set Layer</button>" +
                    "<button class='ctlbtn' id='" + layer_prev_id + "'>Prev Layer</button>" +
                    "<button class='ctlbtn' id='" + layer_next_id + "'>Next Layer</button>" +
                    "</div>";
            }
            jq.html(html);
            if (!jq.data("mouse")) {
                $("#" + box_id).hide();
            }
            jq.mouseover(function(e) {
                jq.data({"mouse": true});
                $("#" + box_id).show();
            });
            jq.mouseout(function(e) {
                jq.data({"mouse": false});
                $("#" + box_id).hide();
            });
            $("#" + transfer_id).click(function() {
                var xten = prompt("Enter Extension");
                if (xten) {
                    confMan.modCommand("transfer", x, xten);
                }
            });
            $("#" + kick_id).click(function() {
                confMan.modCommand("kick", x);
            });
            $("#" + layer_set_id).click(function() {
                var cid = prompt("Please enter layer ID", "");
                if (cid) {
                    confMan.modCommand("vid-layer", x, cid);
                }
            });
            $("#" + layer_next_id).click(function() {
                confMan.modCommand("vid-layer", x, "next");
            });
            $("#" + layer_prev_id).click(function() {
                confMan.modCommand("vid-layer", x, "prev");
            });
            $("#" + canvas_in_set_id).click(function() {
                var cid = prompt("Please enter canvas ID", "");
                if (cid) {
                    confMan.modCommand("vid-canvas", x, cid);
                }
            });
            $("#" + canvas_out_set_id).click(function() {
                var cid = prompt("Please enter canvas ID", "");
                if (cid) {
                    confMan.modCommand("vid-watching-canvas", x, cid);
                }
            });
            $("#" + canvas_in_next_id).click(function() {
                confMan.modCommand("vid-canvas", x, "next");
            });
            $("#" + canvas_in_prev_id).click(function() {
                confMan.modCommand("vid-canvas", x, "prev");
            });
            $("#" + canvas_out_next_id).click(function() {
                confMan.modCommand("vid-watching-canvas", x, "next");
            });
            $("#" + canvas_out_prev_id).click(function() {
                confMan.modCommand("vid-watching-canvas", x, "prev");
            });
            $("#" + tmute_id).click(function() {
                confMan.modCommand("tmute", x);
            });
            if (confMan.params.hasVid) {
                $("#" + tvmute_id).click(function() {
                    confMan.modCommand("tvmute", x);
                });
                $("#" + tvpresenter_id).click(function() {
                    confMan.modCommand("vid-res-id", x, "presenter");
                });
                $("#" + tvfloor_id).click(function() {
                    confMan.modCommand("vid-floor", x, "force");
                });
                $("#" + vbanner_id).click(function() {
                    var text = prompt("Please enter text", "");
                    if (text) {
                        confMan.modCommand("vid-banner", x, escape(text));
                    }
                });
            }
            $("#" + gainup_id).click(function() {
                confMan.modCommand("volume_in", x, "up");
            });
            $("#" + gaindn_id).click(function() {
                confMan.modCommand("volume_in", x, "down");
            });
            $("#" + volup_id).click(function() {
                confMan.modCommand("volume_out", x, "up");
            });
            $("#" + voldn_id).click(function() {
                confMan.modCommand("volume_out", x, "down");
            });
            return html;
        }
        var atitle = "";
        var awidth = 0;
        verto.subscribe(confMan.params.laData.chatChannel, {
            handler: function(v, e) {
                if (typeof(confMan.params.chatCallback) === "function") {
                    confMan.params.chatCallback(v,e);
                }
            }
        });
        if (confMan.params.laData.role === "moderator") {
            atitle = "Action";
            awidth = 600;
            if (confMan.params.mainModID) {
                genMainMod($(confMan.params.mainModID));
                $(confMan.params.displayID).html("Moderator Controls Ready<br><br>");
            } else {
                $(confMan.params.mainModID).html("");
            }
            verto.subscribe(confMan.params.laData.modChannel, {
                handler: function(v, e) {
                    //console.error("MODDATA:", e.data);
                    if (confMan.params.onBroadcast) {
                        confMan.params.onBroadcast(verto, confMan, e.data);
                    }
                    if (e.data["conf-command"] === "list-videoLayouts") {
                        for (var j = 0; j < confMan.canvasCount; j++) {
                            var vlselect_id = "#confman_vl_select_" + j + "_" + confMan.serno;
                            var vlayout_id = "#confman_vid_layout_" + j + "_" + confMan.serno;
                            var x = 0;
                            var options;
                            $(vlselect_id).selectmenu({});
                            $(vlselect_id).selectmenu("enable");
                            $(vlselect_id).empty();
                            $(vlselect_id).append(new Option("Choose a Layout", "none"));
                            if (e.data.responseData) {
                                var rdata = [];
                                for (var i in e.data.responseData) {
                                    rdata.push(e.data.responseData[i].name);
                                }
                                options = rdata.sort(function(a, b) {
                                    var ga = a.substring(0, 6) == "group:" ? true : false;
                                    var gb = b.substring(0, 6) == "group:" ? true : false;
                                    if ((ga || gb) && ga != gb) {
                                    return ga ? -1 : 1;
                                    }
                                    return ( ( a == b ) ? 0 : ( ( a > b ) ? 1 : -1 ) );
                                });
                                for (var i in options) {
                                    $(vlselect_id).append(new Option(options[i], options[i]));
                                    x++;
                                }
                            }
                            if (x) {
                                $(vlselect_id).selectmenu('refresh', true);
                            } else {
                                $(vlayout_id).hide();
                            }
                        }
                    } else {
                        if (!confMan.destroyed && confMan.params.displayID) {
                            $(confMan.params.displayID).html(e.data.response + "<br><br>");
                            if (confMan.lastTimeout) {
                                clearTimeout(confMan.lastTimeout);
                                confMan.lastTimeout = 0;
                            }
                            confMan.lastTimeout = setTimeout(function() { $(confMan.params.displayID).html(confMan.destroyed ? "" : "Moderator Controls Ready<br><br>");}, 4000);
                        }
                    }
                }
            });
            if (confMan.params.hasVid) {
                confMan.modCommand("list-videoLayouts", null, null);
            }
        }
        var row_callback = null;
        if (confMan.params.laData.role === "moderator") {
            row_callback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if (!aData[5]) {
                    var $row = $('td:eq(5)', nRow);
                    genControls($row, aData);
                    if (confMan.params.onLaRow) {
                        confMan.params.onLaRow(verto, confMan, $row, aData);
                    }
                }
            };
        }
        confMan.lt = new liveTable(verto, confMan.params.laData.laChannel, confMan.params.laData.laName, $(confMan.params.tableID), {
            subParams: {
                callID: confMan.params.dialog ? confMan.params.dialog.callID : null
            },
            "onChange": function(obj, args) {
                $(confMan.params.statusID).text("Conference Members: " + " (" + obj.arrayLen() + " Total)");
                if (confMan.params.onLaChange) {
                    confMan.params.onLaChange(verto, confMan, $.verto.enum.confEvent.laChange, obj, args);
                }
            },
            "aaData": [],
            "aoColumns": [
                {
                    "sTitle": "ID",
                    "sWidth": "50"
                },
                {
                    "sTitle": "Number",
                    "sWidth": "250"
                },
                {
                    "sTitle": "Name",
                    "sWidth": "250"
                },
                {
                    "sTitle": "Codec",
                    "sWidth": "100"
                },
                {
                    "sTitle": "Status",
                    "sWidth": confMan.params.hasVid ? "200px" : "150px"
                },
                {
                    "sTitle": atitle,
                "sWidth": awidth,
                }
            ],
            "bAutoWidth": true,
            "bDestroy": true,
            "bSort": false,
            "bInfo": false,
            "bFilter": false,
            "bLengthChange": false,
            "bPaginate": false,
            "iDisplayLength": 1400,
            "oLanguage": {
                "sEmptyTable": "The Conference is Empty....."
            },
            "fnRowCallback": row_callback
        });
    }
    modCommand(cmd, id, value) {
        var confMan = this;
        confMan.verto.call("verto.broadcast", {
            "eventChannel": confMan.params.laData.modChannel,
            "data": {
                "application": "conf-control",
                "command": cmd,
                "id": id,
                "value": value
            }
        });
    }
    sendChat(message, type) {
        var confMan = this;
        confMan.verto.call("verto.broadcast", {
            "eventChannel": confMan.params.laData.chatChannel,
            "data": {
                "action": "send",
                "message": message,
                "type": type
            }
        });
    }
    destroy() {
        var confMan = this;
        confMan.destroyed = true;
        if (confMan.lt) {
            confMan.lt.destroy();
        }
        if (confMan.params.laData.chatChannel) {
            confMan.verto.unsubscribe(confMan.params.laData.chatChannel);
        }
        if (confMan.params.laData.modChannel) {
            confMan.verto.unsubscribe(confMan.params.laData.modChannel);
        }
        if (confMan.params.mainModID) {
            $(confMan.params.mainModID).html("");
        }
    }
}
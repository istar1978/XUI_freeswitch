/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2015-2017, Seven Du <dujinfang@x-y-t.cn>
 *
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is XUI - GUI for FreeSWITCH
 *
 * The Initial Developer of the Original Code is
 * Seven Du <dujinfang@x-y-t.cn>
 * Portions created by the Initial Developer are Copyright (C)
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Seven Du <dujinfang@x-y-t.cn>
 *
 *
 */

'use strict';

Blockly.JSON = Blockly.JavaScript
Blockly.JSON.entry_cache = [];


Blockly.JSON.fsStart = function(block) {
  var code = '\n';
  return code;
};

Blockly.JSON.fsSetTTS = function(block) {
  Blockly.JSON.text_engine = Blockly.JSON.valueToCode(block, 'TTSENGINE', Blockly.JSON.ORDER_ATOMIC);
  Blockly.JSON.text_voice = Blockly.JSON.valueToCode(block, 'VOICE', Blockly.JSON.ORDER_ATOMIC);
  return "";
};

Blockly.JSON.fsSessionPlay = function(block) {
  var value_args = Blockly.JSON.valueToCode(block, 'args', Blockly.JSON.ORDER_ATOMIC);
  var code = 'session:streamFile(' + value_args + ')\n';
  return code;
};

Blockly.JSON.fsSessionSpeak = function(block) {
  var value_args = Blockly.JSON.valueToCode(block, 'args', Blockly.JSON.ORDER_ATOMIC);
  var code = 'session:speak(' + value_args + ')\n';
  return code;
};

Blockly.JSON.fsSessionGet = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var code = 'session:getVariable("' + dropdown_name + '")';
  return [code, Blockly.JSON.ORDER_NONE];
};

Blockly.JSON.fsFilePath = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var code = '"' + dropdown_name + '"';
  return [code, Blockly.JSON.ORDER_NONE];
};

Blockly.JSON.fsFifo = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var code = '"' + dropdown_name + '"';
  return [code, Blockly.JSON.ORDER_NONE];
};

Blockly.JSON.fsSessionTransfer = function(block) {
  var text_dest = Blockly.JSON.valueToCode(block, 'destination', Blockly.JSON.ORDER_ATOMIC);
  var text_dialplan = Blockly.JSON.valueToCode(block, 'dialplan', Blockly.JSON.ORDER_ATOMIC);
  var text_context = Blockly.JSON.valueToCode(block, 'context', Blockly.JSON.ORDER_ATOMIC);
  var code = 'session:execute("transfer",' + text_dest + ' .. ' + '" "' + '..' + text_dialplan + ' .. ' + '" "' + ' .. ' + text_context + ' )\n';
  return code;
};

Blockly.JSON.fsSessionExecute = function(block) {
  var text_app = block.getFieldValue('execute');
  var value_args = Blockly.JSON.valueToCode(block, 'args', Blockly.JSON.ORDER_ATOMIC) || '""';
  var code = 'session:execute("' + text_app + '", ' + value_args + ')\n';
  return code;
};

Blockly.JSON.IVR = function(block) {
  Blockly.JSON.entry_cache = []; // cache entries

  var text_sound = Blockly.JSON.valueToCode(block, 'sound', Blockly.JSON.ORDER_ATOMIC);
  var text_max = Blockly.JSON.valueToCode(block, 'MAX', Blockly.JSON.ORDER_ATOMIC);
  var statements_entries = Blockly.JSON.statementToCode(block, 'entries');
  var statements_default = Blockly.JSON.statementToCode(block, 'default');
  var timeout = 5000;

  if (!(text_sound.indexOf(".") >= 0 || text_sound.indexOf("/") >= 0 || text_sound.indexOf("\\\\") >= 0)) {
    text_sound = 'say:' + text_sound;
  }

  var obj = {
    name: "default",
    greet_long: text_sound,
    digit_len: text_max,
    timeout: timeout
  }

  // var actions = JSON.parse(statements_entries);
  // obj.actions = [];
  // obj.actions.push(actions);

  obj.actions = Blockly.JSON.entry_cache

  var code = JSON.stringify(obj);

  return code;
};

Blockly.JSON.IVREntry = function(block) {
  var text_digit = Blockly.JSON.valueToCode(block, 'case', Blockly.JSON.ORDER_ATOMIC);
  var statements_actions = Blockly.JSON.statementToCode(block, 'actions');

  var obj = JSON.parse(statements_actions);
  obj.digit = text_digit;

  Blockly.JSON.entry_cache.push(obj);

  var code = JSON.stringify(obj);
  return code;
};

Blockly.JSON.IVRAction= function(block) {
  var action = block.getFieldValue('action');
  var args = Blockly.JSON.valueToCode(block, 'args', Blockly.JSON.ORDER_ATOMIC);
  var obj = {action: action, args: args};
  return JSON.stringify(obj);
};

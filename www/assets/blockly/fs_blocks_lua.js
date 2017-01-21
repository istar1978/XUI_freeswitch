/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2015-2016, Seven Du <dujinfang@x-y-t.cn>
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

Blockly.Lua.globalIVREntryStart = 0;

Blockly.Lua.fsStart = function(block) {
  var code = 'tts_engine = "tts_commandline"\ntts_voice = "Ting-Ting"\n' +
    'session:set_tts_params(tts_engine, tts_voice)\n' +
    'session:setVariable("tts_engine", ' + 'tts_engine)\n' +
    'session:setVariable("tts_voice", ' + 'tts_voice)\n' +
    'session:answer()\n';
  return code;
};

Blockly.Lua.fsSessionAnswer = function(block) {
  var code = 'session:answer()\n';
  return code;
}

Blockly.Lua.fsConsoleLog = function(block) {
  var level = block.getFieldValue('Level');
  var text = Blockly.Lua.valueToCode(block, 'args', Blockly.Lua.ORDER_ATOMIC) || '""';
      text = text + ' .. "\\n"';
  var code = 'session:consoleLog("' + level + '", ' + text + ')\n';
  return code;
};

Blockly.Lua.fsSetTTS = function(block) {
  var text_engine = Blockly.Lua.valueToCode(block, 'TTSENGINE', Blockly.Lua.ORDER_ATOMIC);
  var text_voice = Blockly.Lua.valueToCode(block, 'VOICE', Blockly.Lua.ORDER_ATOMIC);
  var code = 'tts_engine = "' + text_engine + '"\ntts_voice = "' + text_voice + '"\n' +
    'session:set_tts_params("' + text_engine + '", "' + text_voice + '")\n' +
    'session:setVariable("tts_engine", ' + 'tts_engine)\n' +
    'session:setVariable("tts_voice", ' + 'tts_voice)\n';
  return code;
};

Blockly.Lua.fsSessionPlay = function(block) {
  var value_args = Blockly.Lua.valueToCode(block, 'args', Blockly.Lua.ORDER_ATOMIC);
  var code = 'session:streamFile(' + value_args + ')\n';
  return code;
};

Blockly.Lua.fsSessionSpeak = function(block) {
  var value_args = Blockly.Lua.valueToCode(block, 'args', Blockly.Lua.ORDER_ATOMIC);
  var code = 'session:speak(' + value_args + ')\n';
  return code;
};

Blockly.Lua.fsSessionGet = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var code = 'session:getVariable("' + dropdown_name + '")';
  return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua.fsFilePath = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var code = '"' + dropdown_name + '"';
  return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua.fsFifo = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var code = '"' + dropdown_name + '"';
  return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua.fsSessionSet = function(block) {
  var text_var = block.getFieldValue('var');
  var text_val = Blockly.Lua.valueToCode(block, 'args',
    Blockly.Lua.ORDER_ATOMIC) || '""';
  var code = 'session:setVariable("' + text_var + '", ' + text_val + ')\n';
  return code;
};

Blockly.Lua.fsSessionRead = function(block) {
  var text_min = Blockly.Lua.valueToCode(block, 'MIN', Blockly.Lua.ORDER_ATOMIC);
  var text_max = Blockly.Lua.valueToCode(block, 'MAX', Blockly.Lua.ORDER_ATOMIC);
  var text_sound = Blockly.Lua.valueToCode(block, 'sound', Blockly.Lua.ORDER_ATOMIC);
  var variable_digits = Blockly.Lua.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var text_timeout = Blockly.Lua.valueToCode(block, 'TIMEOUT', Blockly.Lua.ORDER_ATOMIC);
  var text_terminator = block.getFieldValue('terminator');

  if (!(text_sound.indexOf(".") >= 0 || text_sound.indexOf("/") >= 0 || text_sound.indexOf("\\\\") >= 0)) {
    text_sound = 'say:' + text_sound;
  }

  var code = variable_digits + ' = session:read(' + text_min + ', ' +
    text_max + ', ' +
    text_sound + ', ' +
    text_timeout + ', "' +
    text_terminator + '");\n';
  return code;
};

Blockly.Lua.fsSessionExecute = function(block) {
  var text_app = block.getFieldValue('execute');
  var value_args = Blockly.Lua.valueToCode(block, 'args', Blockly.Lua.ORDER_ATOMIC) || '""';
  var code = 'session:execute("' + text_app + '", ' + value_args + ')\n';
  return code;
};

Blockly.Lua.IVR = function(block) {
  var text_sound = Blockly.Lua.valueToCode(block, 'sound', Blockly.Lua.ORDER_ATOMIC);
  var text_max = Blockly.Lua.valueToCode(block, 'MAX', Blockly.Lua.ORDER_ATOMIC);
  var statements_entries = Blockly.Lua.statementToCode(block, 'entries');
  var statements_default = Blockly.Lua.statementToCode(block, 'default');
  var timeout = 5000;

  if (!(text_sound.indexOf(".") >= 0 || text_sound.indexOf("/") >= 0 || text_sound.indexOf("\\\\") >= 0)) {
    text_sound = 'say:' + text_sound;
  }

  var code = 'digits = session:read(1, ' + text_max + ', ' +
    text_sound + ', ' +
    timeout + ', "#")\n\n'
  code = code + statements_entries;
  code = code + '  else\n  ' + statements_default + '  end\n';
  Blockly.Lua.globalIVREntryStart = 0;
  return code;
};

Blockly.Lua.IVREntry = function(block) {
  // var text_digit = block.getFieldValue('digit');
  var text_digit = Blockly.Lua.valueToCode(block, 'case', Blockly.Lua.ORDER_ATOMIC);
  var statements_actions = Blockly.Lua.statementToCode(block, 'actions');
  var the_else = Blockly.Lua.globalIVREntryStart ? "else" : "";
  Blockly.Lua.globalIVREntryStart = 1;
  var code = the_else + 'if (digits == "' + text_digit + '") then\n' + statements_actions
  return code;
};

Blockly.Lua.fsDBH = function(block) {
  var dsn  = block.getFieldValue('dsn');
  var user = block.getFieldValue('user');
  var pass = block.getFieldValue('pass');

  var code = 'dbh = freeswitch.Dbh("odbc://' + dsn + ':' + user + ':' + pass + '")\n';
  return [code, Blockly.Lua.ORDER_NONE];
};


Blockly.Lua.fsDBHQuery = function(block) {
  var value_sql = Blockly.Lua.valueToCode(block, 'sql', Blockly.Lua.ORDER_ATOMIC);
  var text_sql_callback = block.getFieldValue('sql_callback');
  var code = 'dbh:query(' + value_sql + ', ' + '' + text_sql_callback + '' + ')\n';
  return code;
};

Blockly.Lua.fsDBHRow = function(block) {
  var text_col = block.getFieldValue('col');
  var code = 'row.' + text_col;
  return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua.tNow = function(block) {
  var code = "os.date('*t')";
  return [code, Blockly.Lua.ORDER_NONE];
}

Blockly.Lua.tDate = function(block) {
  var year = block.getFieldValue('year');
  var month = block.getFieldValue('month');
  var day = block.getFieldValue('day');
  var hour = block.getFieldValue('hour');
  var min = block.getFieldValue('min');
  var sec = block.getFieldValue('sec');
  var code = "os.date('*t', os.time{year=" + year +
    ", month=" + month + ", day=" + day +
    ", hour=" + hour + ", min=" + min + ", sec=" + sec + "})";
  return [code, Blockly.Lua.ORDER_NONE];
}

Blockly.Lua.tDateFormat = function(block) {
  var variable_date = Blockly.Lua.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var fmt_field = block.getFieldValue('fmt');

  var code = "os.date('" + fmt_field + "', os.time(" + variable_date + "))";
  return [code, Blockly.Lua.ORDER_NONE];
}

Blockly.Lua.tDateField = function(block) {
  var variable_date = Blockly.Lua.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var dropdown_field = block.getFieldValue('FIELD');

  var code = variable_date + "." + dropdown_field;
  return [code, Blockly.Lua.ORDER_NONE];
}

Blockly.Lua.audioRecord = function(block) {
  var filename  = Blockly.Lua.valueToCode(block, 'name', Blockly.Lua.ORDER_ATOMIC);
  var max_sec = block.getFieldValue("max");
  var threshold = block.getFieldValue("threshold");
  var silence_sec = block.getFieldValue("silence");

  var code = "local recording_dir = '/tmp/'\n";
  if (filename) {
    code = code + "local recording_filename = recording_dir .. '" + filename + "'\n";
  } else {
    code = code + "local uuid = session:get_uuid()\n"
      + "local date=os.date('%Y%m%d%H%M%S')\n"
      + "local recording_filename = string.format('%s%s-%s.wav', recording_dir, uuid, date)\n";
  }
  code = code + "session:recordFile(recording_filename, "+ max_sec + ", " + threshold + ", " + silence_sec + ")";

  return code;
};

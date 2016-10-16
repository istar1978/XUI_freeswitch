'use strict';

Blockly.JavaScript.fsStart = function(block) {
  var code = 'var tts_engine = "tts_commandline"; var tts_voice = "Ting-Ting";\n' +
    'session.read = function(min, max, sound, timeout, terminator) {\n' +
    '  var dtmf = "";\n' +
    '  if (sound.indexOf(".") >= 0 || sound.indexOf("/") >= 0 || sound.indexOf("\\\\") >= 0) {\n' +
    '    session.streamFile(sound, function(s, type, obj, arg) {\n' +
    '      dtmf = obj.digit;\n' +
    '      return(false);\n' +
    '    });\n' +
    '  } else {\n' +
    '    session.speak(tts_engine, tts_voice, sound, function(s, type, obj, arg) {\n' +
    '      dtmf = obj.digit;\n' +
    '      return(false);\n' +
    '    });\n' +
    '  }\n' +
    // '  console_log("err", "DTMF: " + dtmf);\n' +
    '  if (max == 1) return dtmf;\n' +
    '  var digits = session.getDigits(max - 1, terminator, timeout);\n' +
    '  return dtmf + digits;' +
    '}\n';
  return code;
};

Blockly.JavaScript.fsSessionAnswer = function(block) {
  var code = 'session.answer();\n';
  return code;
}

Blockly.JavaScript.fsConsoleLog = function(block) {
  var level = block.getFieldValue('Level');
  var text = Blockly.JavaScript.valueToCode(block, 'args',
    Blockly.JavaScript.ORDER_ATOMIC) || '""';
  var code = 'console_log("' + level + '", ' + text + ');\n';
  return code;
};

Blockly.JavaScript.fsSetTTS = function(block) {
  var text_engine = block.getFieldValue('engine');
  var text_voice = block.getFieldValue('voice');
  var code = 'tts_engine = "' + text_engine + '"; ' +
       'tts_voice = "' + text_voice + '";\n' +
       'session.setVariable("tts_engine", "' + text_engine + '");\n' +
       'session.setVariable("tts_voice", "' + text_voice + '");\n';
  return code;
};

Blockly.JavaScript.fsSessionPlay = function(block) {
  var value_args = Blockly.JavaScript.valueToCode(block, 'args', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'session.streamFile(' + value_args + ');\n';
  return code;
};

Blockly.JavaScript.fsSessionSpeak = function(block) {
  var value_args = Blockly.JavaScript.valueToCode(block, 'args', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'session.speak(tts_engine, tts_voice, ' + value_args + ');\n';
  return code;
};

Blockly.JavaScript.fsSessionGet = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = 'session.getVariable("' + dropdown_name + '")';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.fsSessionSet = function(block) {
  var text_var = block.getFieldValue('var');
  var text_val = Blockly.JavaScript.valueToCode(block, 'args',
    Blockly.JavaScript.ORDER_ATOMIC) || '""';
  var code = 'session.setVariable("' + text_var + '", ' + text_val + ');\n';
  return code;
};

Blockly.JavaScript.fsSessionRead = function(block) {
  var text_min = block.getFieldValue('min');
  var text_max = block.getFieldValue('max');
  var text_sound = block.getFieldValue('sound');
  var variable_digits = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('digits'), Blockly.Variables.NAME_TYPE);
  var text_timeout = block.getFieldValue('timeout');
  var text_terminator = block.getFieldValue('terminator');

  var code = variable_digits + ' = session.read(' + text_min + ', ' +
    text_max + ', ' +
    '"' + text_sound + '", ' +
    text_timeout + ', "' +
    text_terminator + '");\n';
  return code;
};

Blockly.JavaScript.fsSessionExecute = function(block) {
  var text_app = block.getFieldValue('execute');
  var value_args = Blockly.JavaScript.valueToCode(block, 'args', Blockly.JavaScript.ORDER_ATOMIC) || '""';
  var code = 'session.execute("' + text_app + '", ' + value_args + ');\n';
  return code;
};

Blockly.JavaScript.IVR = function(block) {
  var text_sound = block.getFieldValue('sound');
  var text_max = block.getFieldValue('max');
  var statements_entries = Blockly.JavaScript.statementToCode(block, 'entries');
  var statements_default = Blockly.JavaScript.statementToCode(block, 'default');
  var timeout = 5000;

  var code = 'digits = session.read(1, ' + text_max + ', ' +
    '"' + text_sound + '", ' +
    timeout + ', "#");\n' +
    'switch (digits) {\n';
  code = code + statements_entries;
  code = code + 'default: \n' + statements_default;
  code = code + "}\n";
  return code;
};

Blockly.JavaScript.IVREntry = function(block) {
  var text_digit = block.getFieldValue('digit');
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'actions');
  var code = 'case "' + text_digit + '": ' + statements_actions +
    'break;\n';
  return code;
};
